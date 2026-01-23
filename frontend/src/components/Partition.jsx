export default function Partition({ data }) {
    const style = data?.style || 'gradient-line';

    return (
        <div className="py-12 flex items-center justify-center">
            {style === 'gradient-line' && (
                <div className="w-[85%] max-w-7xl h-px bg-gradient-to-r from-transparent via-brand-blue/30 to-transparent relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-brand-peach rounded-full outline outline-4 outline-brand-cream shadow-sm"></div>
                </div>
            )}
            {style === 'simple' && (
                <div className="w-[85%] max-w-7xl h-px bg-gray-200"></div>
            )}
            {style === 'dots' && (
                <div className="w-[85%] max-w-7xl border-t-2 border-dotted border-brand-blue/30"></div>
            )}
        </div>
    );
}
