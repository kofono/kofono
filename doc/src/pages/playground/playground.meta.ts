export const Playground: DocComponentPageMeta = {
    title: "Playground",
    menuTitle: "Playground",
    path: "/playground",
    description: "Kofono playground",
    keywords: ["kofono", "form", "schema", "typescript", "playground"],
    loader: () => import("./playground"),
};
