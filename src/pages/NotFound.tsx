import { Link } from "react-router";

export default function NotFound() {
    return (
        <div className="flex min-h-full items-center justify-center p-6">
            <div className="max-w-md text-center">
                <h1 className="text-4xl font-bold">404 — Page not found</h1>
                <p className="mt-4 text-muted-foreground">
                    Sorry, we couldn't find the page you're looking for.
                </p>
                <div className="mt-6 flex justify-center gap-3">
                    <Link to="/" className="rounded-md bg-primary px-4 py-2 text-white">
                        Go home
                    </Link>
                </div>
            </div>
        </div>
    );
}
