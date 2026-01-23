import { Plus, Trash2, GripVertical } from 'lucide-react';

export default function ArrayEditor({
    items = [],
    onChange,
    renderItem,
    addLabel = 'Add Item',
    emptyMessage = 'No items yet'
}) {
    const handleAdd = () => {
        onChange([...items, {}]);
    };

    const handleUpdate = (index, updates) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], ...updates };
        onChange(newItems);
    };

    const handleRemove = (index) => {
        onChange(items.filter((_, i) => i !== index));
    };

    const handleMove = (fromIndex, toIndex) => {
        if (toIndex < 0 || toIndex >= items.length) return;
        const newItems = [...items];
        const [removed] = newItems.splice(fromIndex, 1);
        newItems.splice(toIndex, 0, removed);
        onChange(newItems);
    };

    return (
        <div className="space-y-3">
            {items.length > 0 ? (
                <div className="space-y-2">
                    {items.map((item, index) => (
                        <div
                            key={index}
                            className="flex items-start gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200"
                        >
                            <div className="flex flex-col gap-1 pt-2">
                                <button
                                    onClick={() => handleMove(index, index - 1)}
                                    disabled={index === 0}
                                    className="p-1 hover:bg-slate-200 rounded disabled:opacity-30"
                                >
                                    <GripVertical size={14} className="rotate-180" />
                                </button>
                                <button
                                    onClick={() => handleMove(index, index + 1)}
                                    disabled={index === items.length - 1}
                                    className="p-1 hover:bg-slate-200 rounded disabled:opacity-30"
                                >
                                    <GripVertical size={14} />
                                </button>
                            </div>

                            <div className="flex-1">
                                {renderItem(item, (updates) => handleUpdate(index, updates), index)}
                            </div>

                            <button
                                onClick={() => handleRemove(index)}
                                className="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500 transition-colors"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-6 text-slate-400 text-sm bg-slate-50 rounded-lg border border-dashed border-slate-200">
                    {emptyMessage}
                </div>
            )}

            <button
                onClick={handleAdd}
                className="w-full py-2 border-2 border-dashed border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:border-blue-400 hover:text-blue-500 transition-colors flex items-center justify-center gap-2"
            >
                <Plus size={16} />
                {addLabel}
            </button>
        </div>
    );
}
