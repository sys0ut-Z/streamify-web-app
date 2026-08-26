export const ROTATE_REFRESH_TOKEN_SCRIPT = `
  -- * NOTE 1 : oldRt -> currently active rt and is NOT marked "used"
  -- * NOTE 2 : newRt -> is going to be marked active
  -- * NOTE 3 : currentRt -> hash of oldRt that is stored in session key

  local sessionKey = KEYS[1]
  local oldRtKey = KEYS[2]
  local newRtKey = KEYS[3]

  local newRtHash = ARGV[1]
  local ttl = tonumber(ARGV[2])

  local revoked =
    redis.call("HGET", sessionKey, "revoked")

  if revoked == "true" then
    return {0, "SESSION_REVOKED"}
  end

  local currentRt =
    redis.call("HGET", sessionKey, "currentRt")

  local oldStatus =
    redis.call("HGET", oldRtKey, "status")

  -- oldRt is already marked "used" before rotating it to new
  if oldStatus == "used" then
    return {0, "REUSE_DETECTED"}
  end

  -- case 1 : if user/hacker sends fake or random rt and the token is not found
  --          it would be nil(null) and it not equal to "active", so condition becomes true
  -- **       it handles : expired, revoked, blocked, nil
  -- case 2 : if oldRt is correct, then this condition("active" ~= "active") would become false
  if oldStatus ~= "active" then
    return {0, "INVALID_REFRESH_TOKEN"}
  end

  -- currentRtHash is hash of oldRt that is stored in session key
  -- what the condition is telling is that both (hash of oldRt from session key) & (currentRt) should be same to allow rotation
  if currentRt ~= ARGV[3] then
    return {0, "REUSE_DETECTED"}
  end

  -- mark current(old) rt key as "used"
  redis.call(
    "HSET",
    oldRtKey,
    "status",
    "used",
    "replacedBy",
    newRtHash
  )

  -- * NOTE 4 : session id & family id will be same for tokens
  -- get id of active session
  local sessionId =
    redis.call(
      "HGET",
      sessionKey,
      "sessionId"
    )

  -- get family id for tokens, every token will belong to same family
  local familyId =
    redis.call(
      "HGET",
      sessionKey,
      "familyId"
    )

  -- create new rt key and mark it as "active"
  redis.call(
    "HSET",
    newRtKey,
    "sessionId",
    sessionId,
    "familyId",
    familyId,
    "status",
    "active",
    "replacedBy",
    ""
  )

  -- set expiry for new rt
  redis.call(
    "EXPIRE",
    newRtKey,
    ttl
  )

  -- set newRtHash in session key implying that new rt is currently active rt(currentRt)
  redis.call(
    "HSET",
    sessionKey,
    "currentRt",
    newRtHash
  )

  return {1, "OK"}
`;

/* 
  keys: [
      sessionKey, -> sesion key
      oldRtKey, -> old refresh token key
      newRtKey -> new refresh token key
    ],

  args: [
      newRtHash, -> hash of new refresh token
      ttl, -> TTL
      currentRtHash -> hash of old(currently active) rt
    ]
*/