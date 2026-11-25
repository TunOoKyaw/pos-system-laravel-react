import { useForm } from '@inertiajs/react';
import { Category, Product } from '@/types';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

interface Props {
    categories: Category[];
    product?: Product | null;
    onClose: () => void;
}

export default function ProductForm({ categories, product, onClose }: Props) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: product?.name ?? '',
        category_id: product?.category_id?.toString() ?? '',
        description: product?.description ?? '',
        price: product?.price ?? '',
        stock: product?.stock?.toString() ?? '0',
        is_active: product?.is_active ?? true,
        image: null as File | null,
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();

        const options = {
            forceFormData: true,
            onSuccess: () => {
                toast.success(
                    product
                        ? 'Product updated successfully'
                        : 'Product created successfully',
                );
                reset();
                onClose();
            },
        };

        if (product) {
            put(`/products/${product.id}`, options);
        } else {
            post('/products', options);
        }
    }

    return (
        <Dialog open onOpenChange={onClose}>
            <DialogContent className="max-w-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        {product ? 'Edit Product' : 'Add Product'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div>
                        <Label htmlFor="category_id">Category</Label>
                        <Select
                            value={data.category_id}
                            onValueChange={(value) =>
                                setData('category_id', value)
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((category) => (
                                    <SelectItem
                                        key={category.id}
                                        value={category.id.toString()}
                                    >
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.category_id} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="price">Price</Label>
                            <Input
                                id="price"
                                type="number"
                                step="0.01"
                                min="0.01"
                                value={data.price}
                                onChange={(e) =>
                                    setData('price', e.target.value)
                                }
                            />
                            <InputError message={errors.price} />
                        </div>

                        <div>
                            <Label htmlFor="stock">Stock</Label>
                            <Input
                                id="stock"
                                type="number"
                                min="0"
                                value={data.stock}
                                onChange={(e) =>
                                    setData('stock', e.target.value)
                                }
                            />
                            <InputError message={errors.stock} />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Input
                            id="description"
                            value={data.description}
                            onChange={(e) =>
                                setData('description', e.target.value)
                            }
                        />
                        <InputError message={errors.description} />
                    </div>

                    <div>
                        <Label htmlFor="image">Product Image</Label>
                        <Input
                            id="image"
                            type="file"
                            onChange={(e) =>
                                setData('image', e.target.files?.[0] || null)
                            }
                        />
                        <InputError message={errors.image} />
                    </div>

                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="is_active"
                            checked={data.is_active}
                            onChange={(e) =>
                                setData('is_active', e.target.checked)
                            }
                        />
                        <Label htmlFor="is_active">
                            Active (Visible in POS)
                        </Label>
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                        <Button
                            variant="outline"
                            type="button"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {product ? 'Update Product' : 'Create Product'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
