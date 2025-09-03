import { DesktopListItemRow, DesktopListItemCell, Category } from '@/app/components';

interface DesktopCategoryRowProps<T extends Category> {
	category: T;
	onEdit: (category: T) => void;
	onDelete: (id: number) => void;
}

export function DesktopCategoryRow<T extends Category>(props: DesktopCategoryRowProps<T>) {
	const handleEdit = () => props.onEdit(props.category);
	const handleDelete = () => props.onDelete(props.category.id as number);
	
  return (
    <DesktopListItemRow key={props.category.id} onEdit={handleEdit} onDelete={handleDelete}>
			<DesktopListItemCell title={props.category.name}>
				{props.category.name}
			</DesktopListItemCell>
		</DesktopListItemRow>
  )
}
