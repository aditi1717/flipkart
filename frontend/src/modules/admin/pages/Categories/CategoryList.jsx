import React, { useState, useEffect } from 'react';
import { MdAdd, MdEdit, MdDelete, MdExpandMore, MdChevronRight, MdCheckCircle, MdCancel } from 'react-icons/md';
import useCategoryStore from '../../store/categoryStore';
import CategoryForm from './CategoryForm';
import Pagination from '../../components/common/Pagination';
import { confirmToast } from '../../../../utils/toastUtils.jsx';

const CategoryList = () => {
    const { categories, deleteCategory, toggleCategoryStatus, fetchCategories } = useCategoryStore();
    const [expandedIds, setExpandedIds] = useState(new Set());
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);
    const [editingCategory, setEditingCategory] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const totalPages = Math.ceil(categories.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedCategories = categories.slice(startIndex, startIndex + itemsPerPage);

    const toggleExpand = (id) => {
        const newExpanded = new Set(expandedIds);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedIds(newExpanded);
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setShowForm(true);
    };

    const handleDelete = (id, name) => {
        confirmToast({
            message: `Are you sure you want to delete "${name}"?\nAll subcategories will also be deleted.`,
            type: 'danger',
            icon: 'delete_sweep',
            confirmText: 'Delete Category',
            onConfirm: () => deleteCategory(id)
        });
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditingCategory(null);
    };

    const renderCategory = (category, level = 0) => {
        const hasChildren = category.children && category.children.length > 0;
        const categoryId = category.id || category._id;
        const isExpanded = expandedIds.has(categoryId);
        const indent = level * 32;

        return (
            <div key={categoryId}>
                <div
                    className="flex items-center justify-between p-4 hover:bg-gray-50 border-b border-gray-100 transition"
                    style={{ paddingLeft: `${indent + 16}px` }}
                >
                    <div className="flex items-center gap-3 flex-1">
                        {hasChildren ? (
                            <button
                                onClick={() => toggleExpand(categoryId)}
                                className="p-1 hover:bg-gray-200 rounded transition"
                            >
                                {isExpanded ? (
                                    <MdExpandMore size={20} className="text-gray-600" />
                                ) : (
                                    <MdChevronRight size={20} className="text-gray-600" />
                                )}
                            </button>
                        ) : (
                            <div className="w-7" />
                        )}

                        {category.image ? (
                            <img
                                src={category.image}
                                alt={category.name}
                                className="w-10 h-10 rounded-lg object-cover bg-gray-100"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 font-bold text-xs uppercase">
                                {category.name.substring(0, 2)}
                            </div>
                        )}

                        <div>
                            <h4 className="font-semibold text-gray-800">{category.name}</h4>
                            {category.parentId && (
                                <p className="text-xs text-gray-500">Level {level + 1}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Visual Toggle Switch */}
                        <div
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleCategoryStatus(categoryId);
                            }}
                            className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${category.active ? 'bg-green-500' : 'bg-gray-300'}`}
                        >
                            <div
                                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${category.active ? 'translate-x-5' : 'translate-x-0'}`}
                            />
                        </div>

                        <button
                            onClick={() => {
                                setEditingCategory({ parentId: categoryId });
                                setShowForm(true);
                            }}
                            className="p-2 hover:bg-green-50 rounded-lg text-green-600 transition"
                            title="Add Subcategory"
                        >
                            <MdAdd size={18} />
                        </button>

                        <button
                            onClick={() => handleEdit(category)}
                            className="p-2 hover:bg-blue-50 rounded-lg text-blue-600 transition"
                            title="Edit"
                        >
                            <MdEdit size={18} />
                        </button>

                        <button
                            onClick={() => handleDelete(categoryId, category.name)}
                            className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition"
                            title="Delete"
                        >
                            <MdDelete size={18} />
                        </button>
                    </div>
                </div>

                {hasChildren && isExpanded && (
                    <div>
                        {category.children.map(child => renderCategory(child, level + 1))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Category Management</h1>
                    <p className="text-gray-500 mt-1">Manage product categories and subcategories</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    <MdAdd size={20} />
                    Add Category
                </button>
            </div>

            {/* Category Tree */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800">Category Hierarchy</h2>
                </div>

                {categories.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        <p>No categories found. Create your first category.</p>
                    </div>
                ) : (
                    <div>
                        {paginatedCategories.map(category => renderCategory(category))}
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            )}

            {/* Add/Edit Form Modal */}
            {showForm && (
                <CategoryForm
                    category={editingCategory}
                    onClose={handleCloseForm}
                />
            )}
        </div>
    );
};

export default CategoryList;
