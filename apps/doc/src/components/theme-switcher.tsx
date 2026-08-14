import { VsColorMode } from "solid-icons/vs";
import { For } from "solid-js";

const themes = [
    "light",
    "dark",
    "cupcake",
    "bumblebee",
    "emerald",
    "corporate",
    "synthwave",
    "retro",
    "cyberpunk",
    "valentine",
    "halloween",
    "garden",
    "forest",
    "aqua",
    "lofi",
    "pastel",
    "fantasy",
    "wireframe",
    "black",
    "luxury",
    "dracula",
    "cmyk",
    "autumn",
    "business",
    "acid",
    "lemonade",
    "night",
    "coffee",
    "winter",
    "dim",
    "nord",
    "sunset",
    "caramellatte",
    "abyss",
    "silk",
];

export function ThemeSwitcher() {
    const userTheme = localStorage.getItem("theme") || "light";
    const updateTheme = (theme: string) => {
        localStorage.setItem("theme", theme);
        document.documentElement.setAttribute("data-theme", theme);
    };
    return (
        <div class="dropdown dropdown-end">
            <button type="button" class="btn btn-primary">
                <VsColorMode class="inline-block w-6 h-6" />
                <svg
                    aria-hidden="true"
                    width="12px"
                    height="12px"
                    class="inline-block ml-2 h-2 w-2 fill-current opacity-60"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 2048 2048">
                    <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
                </svg>
            </button>
            <ul
                tabIndex="-1"
                class="dropdown-content bg-base-300 rounded-box z-1 w-52 p-2 mt-2 shadow-2xl">
                <For each={themes}>
                    {theme => (
                        <li>
                            <input
                                type="radio"
                                name="theme-dropdown"
                                class="theme-controller w-full btn btn-sm btn-block btn-ghost justify-start"
                                aria-label={theme}
                                value={theme}
                                checked={userTheme === theme}
                                onChange={() => updateTheme(theme)}
                            />
                        </li>
                    )}
                </For>
            </ul>
        </div>
    );
}
