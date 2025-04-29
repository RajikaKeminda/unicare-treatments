import { z } from 'zod';
import Category, { ICategory } from '../models/categoryModel.js';

// Validation schemas
const createCategorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name is too long'),
  description: z.string().optional(),
});

const updateCategorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name is too long').optional(),
  description: z.string().optional(),
});

class CategoryService {
  // Create a new category
  async createCategory(data: { name: string; description?: string }): Promise<ICategory> {
    try {
      // Validate data
      const validated = createCategorySchema.parse(data);
      
      // Check if category already exists
      const existingCategory = await Category.findOne({ name: validated.name });
      if (existingCategory) {
        throw new Error('Category with this name already exists');
      }
      
      // Create and return the new category
      const category = new Category(validated);
      return await category.save();
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(error.errors[0].message);
      }
      throw error;
    }
  }

  // Get all categories
  async getAllCategories() {
    try {
      const categories = await Category.find().sort({ name: 1 });
      return categories;
    } catch (error) {
      throw new Error('Failed to fetch categories');
    }
  }

  // Get a category by ID
  async getCategoryById(id: string): Promise<ICategory> {
    try {
      const category = await Category.findById(id);
      if (!category) {
        throw new Error('Category not found');
      }
      return category;
    } catch (error) {
      throw error;
    }
  }

  // Update a category
  async updateCategory(id: string, data: { name?: string; description?: string }): Promise<ICategory> {
    try {
      // Validate data
      const validated = updateCategorySchema.parse(data);
      
      // Check if category exists
      const category = await Category.findById(id);
      if (!category) {
        throw new Error('Category not found');
      }
      
      // Check if name is being updated and is unique
      if (validated.name && validated.name !== category.name) {
        const existingCategory = await Category.findOne({ name: validated.name });
        if (existingCategory) {
          throw new Error('Category with this name already exists');
        }
      }
      
      // Update and return the category
      const updatedCategory = await Category.findByIdAndUpdate(
        id,
        { $set: validated },
        { new: true }
      );
      
      if (!updatedCategory) {
        throw new Error('Category not found');
      }
      
      return updatedCategory;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(error.errors[0].message);
      }
      throw error;
    }
  }

  // Delete a category
  async deleteCategory(id: string): Promise<void> {
    try {
      const result = await Category.findByIdAndDelete(id);
      if (!result) {
        throw new Error('Category not found');
      }
    } catch (error) {
      throw error;
    }
  }
}

export default new CategoryService(); 