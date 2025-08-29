type Route = {
    path?: string;
    index?: boolean;
    children?: Route[];
    // allow other router-specific properties
    [key: string]: unknown;
};

function extractPaths(routes: Route[]) {
    const paths: string[] = [];

    function normalizeSegment(segment: string) {
        return segment.replace(/^\/+|\/+$/g, "");
    }

    function makeFull(parent: string, route: Route) {
        // index route -> same as parent
        if (route.index) {
            return parent === "" ? "/" : parent;
        }

        const p = route.path ?? "";
        if (p === "/") return "/";
        if (p === "*") return parent === "" ? "/*" : `${parent.replace(/\/+$/, "")}/*`;

        // absolute path
        if (p.startsWith("/")) return p;

        const seg = normalizeSegment(p);
        if (!seg) return parent || "/";

        if (!parent || parent === "/") return `/${seg}`;
        return `${parent.replace(/\/+$/, "")}/${seg}`;
    }

    function walk(list: Route[], parent = "") {
        list.forEach(r => {
            const full = makeFull(parent, r);
            // avoid duplicates
            if (full && !paths.includes(full)) paths.push(full);
            if (r.children) walk(r.children, full === "/" ? "" : full);
        });
    }

    walk(routes, "");
    return paths;
}

export default extractPaths;
