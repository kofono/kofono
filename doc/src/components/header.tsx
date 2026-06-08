import { ThemeSwitcher } from "@kofono/solid-form";
import { A } from "@solidjs/router";
import { CgFormatCenter } from "solid-icons/cg";
import { VsGithub } from "solid-icons/vs"
import { H2 } from "@/components/html";
import { Search } from "@/components/search";

export function Header() {
    return (
        <div class="px-4 py-2 bg-primary shadow-2xl ">
            <div class="flex flex-row justify-between ">
                <H2 class="m-0 p-0 leading-10 text-primary-content font-bold">
                    <A href={"/"}>
                        {/*<TbForms />*/}
                        <CgFormatCenter class="inline-block w-6 h-6 mr-2 -mt-1 text-(--color-brand)" />
                        <span class="bg-primary-content/10 p-2 rounded-md text-(--color-brand)">Kofono docs</span>
                        <sup class="ml-2 -mt-1 font-light text-xs text-(--color-brand)">
                            v{import.meta.env.VITE_VERSION}
                        </sup>
                    </A>
                </H2>
                <div class="flex flex-row gap-2 align-bottom">
                    <Search />
                    <a
                        href={import.meta.env.VITE_GITURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        class="btn btn-primary">
                        <VsGithub class="w-6 h-6 text-(--color-brand)" />
                    </a>
                    <ThemeSwitcher class="text-(--color-brand)" />
                </div>
            </div>
        </div>
    );
}
