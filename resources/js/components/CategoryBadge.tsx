import { Badge } from '@/components/ui/badge';
import * as Icons from 'lucide-react';
import type { Category } from '@/types';

const colorMap: Record<string, string> = {
    orange: 'bg-orange-100 text-orange-700',
    blue: 'bg-blue-100 text-blue-700',
    purple: 'bg-purple-100 text-purple-700',
    green: 'bg-green-100 text-green-700',
    pink: 'bg-pink-100 text-pink-700',
    red: 'bg-red-100 text-red-700',
    gray: 'bg-gray-100 text-gray-700',
};

function getIcon(iconName: string) {
    const pascalName = iconName
        .split('-')
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join('');
    const IconComponent = (Icons as Record<string, React.ComponentType<{ className?: string }>>)[pascalName];
    return IconComponent || Icons.Circle;
}

export default function CategoryBadge({ category }: { category: Category }) {
    const IconComponent = getIcon(category.icon);
    const colorClasses = colorMap[category.color] || colorMap.gray;

    const displayName = category.parent
        ? `${category.parent.name} > ${category.name}`
        : category.name;

    return (
        <Badge variant="secondary" className={`gap-1.5 ${colorClasses}`}>
            <IconComponent className="h-3.5 w-3.5" />
            {displayName}
        </Badge>
    );
}
