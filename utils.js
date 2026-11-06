import {Alert, Platform} from 'react-native';
import {COURSES} from './constants';



export const filterMenuItems = (items, searchQuery, selectedCourse) => {
  const query = searchQuery.trim().toLowerCase();
  return items.filter((item) => {
    const matchesSearch = item.dishName.toLowerCase().includes(query);
    const matchesCourse = selectedCourse === 'All' || item.course === selectedCourse;
    return matchesSearch && matchesCourse;
  });
};

export const calculateStats = (items) => {
  const totalItems = items.length;
  const averagePrice =
    totalItems === 0 ? 0 : items.reduce((sum, item) => sum + item.price, 0) / totalItems;
  const courseCounts = COURSES.map((courseName) => ({
    course: courseName,
    count: items.filter((item) => item.course === courseName).length,
  }));
  return { totalItems, averagePrice, courseCounts };
};
export const validateMenuItem = ({ dishName, description, price }, menuItems, editingId) => {
  const errors = {};
  const name = dishName.trim();

  if (!name) {
    errors.dishName = 'Dish name is required';
  } else if (name.length < 2) {
    errors.dishName = 'Dish name must be at least 2 characters';
  } else if (
    menuItems.some(
      (item) => item.id !== editingId && item.dishName.toLowerCase() === name.toLowerCase()
    )
  ) {
    errors.dishName = 'A dish with this name already exists';
  }

  const desc = description.trim();
  if (!desc) {
    errors.description = 'Description is required';
  } else if (desc.length < 5) {
    errors.description = 'Description must be at least 5 characters';
  }

  const priceNumber = Number(price);
  if (!price.trim()) {
    errors.price = 'Price is required';
  } else if (isNaN(priceNumber)) {
    errors.price = 'Price must be a number';
  } else if (priceNumber <= 0) {
    errors.price = 'Price must be greater than 0';
  } else if (priceNumber > 10000) {
    errors.price = 'Price cannot be more than R10 000';
  }

  return errors;
};
export const confirmDelete = (dishName, onConfirm) => {
  if (Platform.OS === 'web') {
    if (window.confirm(`Delete "${dishName}"?`)) onConfirm();
    return;
  }
  Alert.alert('Delete item', `Are you sure you want to delete "${dishName}"?`, [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Delete', style: 'destructive', onPress: onConfirm },
  ]);
};