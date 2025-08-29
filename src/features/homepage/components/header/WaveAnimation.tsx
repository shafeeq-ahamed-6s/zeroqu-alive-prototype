export function WaveAnimation() {
    return (
        <div className="absolute inset-0 overflow-hidden">
            <svg
                className="absolute bottom-0 left-0 w-full h-full"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                viewBox="0 24 150 28"
                preserveAspectRatio="none"
                shapeRendering="auto"
            >
                <defs>
                    <path
                        id="gentle-wave"
                        d="m-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
                    />
                </defs>
                <g className="wave-layers">
                    <use xlinkHref="#gentle-wave" x="48" y="0" className="wave-layer-1" />
                    <use xlinkHref="#gentle-wave" x="48" y="3" className="wave-layer-2" />
                    <use xlinkHref="#gentle-wave" x="48" y="5" className="wave-layer-3" />
                    <use xlinkHref="#gentle-wave" x="48" y="7" className="wave-layer-4" />
                </g>
            </svg>
        </div>
    );
}
