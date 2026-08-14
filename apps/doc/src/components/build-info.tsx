export function BuildInfo() {
    const formatted = new Date(__BUILD_DATE__).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });

    return <span class="text-xs opacity-70">Built {formatted}</span>;
}
