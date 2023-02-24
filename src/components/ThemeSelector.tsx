import { useState } from "react"

type ThemeSelectorProps = {
  theme:  string
  themes: string[]
  setTheme: React.Dispatch<React.SetStateAction<string>>
}

export default function ThemeSelector(props: ThemeSelectorProps) {
  const { theme, themes, setTheme } = props
  const [isOpen, setIsOpen] = useState(false)
  const toggleDropdown = () => setIsOpen(!isOpen)

  return (
    <div className="relative">
      <button
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        onClick={toggleDropdown}
      >
        <code>{theme.length === 0 ? "%select-a-theme" : theme}</code>
      </button>
      <ul className={`bg-white w-full absolute rounded ${isOpen && 'border shadow'}`}>
        {isOpen && (
        <>
          {  themes.map((theme, i) => { return (
            <div className="bg-white m-auto">
              <button
                key={i}
                className="block text-blue rounded py-2 w-full m-auto"
                onClick={() => {setTheme(theme); toggleDropdown()}}
              >
                <code>{theme}</code>
              </button>
            </div>
          )})}
          <button
            className="block text-blue rounded py-2 w-full m-auto"
            onClick={() => {console.log('new theme')}}
          >
            <code>%new-theme</code>
          </button>
          </>
        )}
      </ul>
    </div>
  )
}
