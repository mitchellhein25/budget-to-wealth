import { Category, MobileListItemCard, MobileListItemCardHeader, MobileListItemCardContent } from "@/app/components";

interface MobileCategoryCardProps<T extends Category> {
	category: T;
	onEdit: (category: T) => void;
	onDelete: (id: number) => void;
}

export function MobileCategoryCard<T extends Category>({ category, onEdit, onDelete }: MobileCategoryCardProps<T>) {
	const handleEdit = () => onEdit(category);
	const handleDelete = () => onDelete(category.id as number);

	return (
		<MobileListItemCard>
			<MobileListItemCardHeader
				leftContent={
					<div className="text-lg font-bold text-base-content">
						{category.name}
					</div>
				}
			/>
			<MobileListItemCardContent
				description={null}
				onEdit={handleEdit}
				onDelete={handleDelete}
			/>
		</MobileListItemCard>
	);
}
