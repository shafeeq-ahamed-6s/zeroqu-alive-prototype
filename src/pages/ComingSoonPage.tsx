import { Button } from "@/components/ui/button";
import { Link } from "react-router";

interface ComingSoonPageProps {
    featureName?: string;
    description?: string;
    estimatedRelease?: string;
    contactEmail?: string;
    imageUrl?: string;
    ctaLink?: string;
    ctaText?: string;
    showCountdown?: boolean;
}

export function ComingSoonPage({
    featureName = "Feature",
    description = "We're working hard to bring you this exciting new feature. Stay tuned!",
    contactEmail = "info@the6sconsulting.com",
    ctaLink = "/",
    ctaText = "Back to Home",
}: ComingSoonPageProps) {
    return (
        <div className="flex min-h-full flex-col items-center justify-center bg-background text-center">
            <div className="w-full max-w-md space-y-8 rounded-lg border border-border bg-card p-8 shadow-lg">
                <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground">
                    {featureName} <span className="text-primary-foreground">Coming Soon</span>
                </h1>

                <p className="mb-6 text-muted-foreground">{description}</p>

                <div className="space-y-4">
                    {contactEmail && (
                        <>
                            <h1 className="text-muted-foreground">Questions?</h1>
                            <p className="text-muted-foreground">
                                Contact us at{" "}
                                <a
                                    href={`mailto:${contactEmail}`}
                                    className="text-ring hover:underline"
                                >
                                    {contactEmail}
                                </a>
                            </p>
                        </>
                    )}

                    <Button variant="outline" className="mt-4 w-full">
                        <Link to={ctaLink}>{ctaText}</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default ComingSoonPage;
