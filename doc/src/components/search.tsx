import { tableOfContents } from "@/table-of-contents";

export function Search() {
    const search = (s: string) => {
        const result = tableOfContents.filter(item => item.title.includes(s));
        console.log(s, result);
    };
    return (
        <label class="input w-96 transition-colors ease-in-out text-(--color-brand)">
            <svg
                aria-hidden="true"
                class="h-[1em] opacity-50"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24">
                <g
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    stroke-width="2.5"
                    fill="none"
                    stroke="currentColor">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.3-4.3"></path>
                </g>
            </svg>
            <input
                type="search"
                required
                placeholder="Search"
                class=""
                onKeyDown={e => search(e.currentTarget.value)}
            />
        </label>
    );
}
