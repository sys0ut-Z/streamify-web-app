import { PaletteIcon } from "lucide-react";
import { useThemeStore } from "../../store/theme.store";
import { THEMES } from "../../constants/constants";

const ThemeSelector = () => {
  const {theme, setTheme} = useThemeStore();
  return (
    <div className="dropdown dropdown-end">
      {/* Dropdown trigger */}
      <button className="btn btn-ghost btn-circle" tabIndex={0}>
        <PaletteIcon className="size-5"/>
      </button>

      <div tabIndex={0} className="dropdown-content mt-2 p-1 shadow-2xl bg-base-200 backdrop-blur-lg rounded-2xl
        w-56 lg:w-60 border border-base-content/10 max-h-80 overflow-y-auto">
        <div className="space-y-1">
          {THEMES.map(({name, label, colors}) => (
            <button
              key={name}
              className={`btn btn-ghost btn-sm normal-case w-full ${theme === name ? "bg-primary/10 text-primary" : "hover:bg-base-content/5"}`}
              onClick={() => setTheme(name)}
            >
              <PaletteIcon className="size-3.5"/>
              <span className="text-sm font-medium">{label}</span>
              {/* Theme preview colors */}
              <div className="ml-auto flex gap-1">
                {colors.map((color, i) => (
                  <span
                    key={i}
                    className="size-2 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ThemeSelector