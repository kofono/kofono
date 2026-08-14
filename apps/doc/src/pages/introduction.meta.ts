export const Introduction: DocComponentPageMeta = {
    title: "Introduction to Kofono",
    menuTitle: "Introduction",
    path: "/",
    description: "Kofono official documentation",
    keywords: ["kofono", "headless", "form", "schema", "typescript"],
    loader: () => import("./introduction"),
};
