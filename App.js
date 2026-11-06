import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ScrollView } from 'react-native';

import { COURSES, COLORS } from './constants';
import { validateMenuItem, filterMenuItems, calculateStats, confirmDelete } from './utils';
import FormField from './components/FormField';
import CourseSelector from './components/CourseSelector';
import MenuItemCard from './components/MenuItemCard';
import StatsCard from './components/StatsCard';
import FeedbackBanner from './components/FeedbackBanner';
import TabBar from './components/TabBar';

export default function App() {
  const [dishName, setDishName] = useState('');
  const [description, setDescription] = useState('');
  const [course, setCourse] = useState('Starter');
  const [price, setPrice] = useState('');
  const [menuItems, setMenuItems] = useState([]);
  const [errors, setErrors] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('All');
  const [feedback, setFeedback] = useState(null);
  const [activeTab, setActiveTab] = useState('menu');

  const feedbackTimer = useRef(null);

  const showFeedback = (text, type = 'success') => {
    clearTimeout(feedbackTimer.current);
    setFeedback({ text, type });
    feedbackTimer.current = setTimeout(() => setFeedback(null), 3000);
  };

  const resetForm = () => {
    setDishName('');
    setDescription('');
    setCourse('Starter');
    setPrice('');
    setErrors({});
    setEditingId(null);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCourse('All');
  };

  const handleSubmit = () => {
    const validationErrors = validateMenuItem(
      { dishName, description, price },
      menuItems,
      editingId
    );
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      showFeedback('Please fix the highlighted fields.', 'error');
      return;
    }

    const itemData = {
      dishName: dishName.trim(),
      description: description.trim(),
      course,
      price: Number(price),
    };

    if (editingId) {
      setMenuItems((current) =>
        current.map((item) => (item.id === editingId ? { ...item, ...itemData } : item))
      );
      showFeedback(`"${itemData.dishName}" updated.`);
    } else {
      setMenuItems((current) => [...current, { id: Date.now().toString(), ...itemData }]);
      showFeedback(`"${itemData.dishName}" added to the menu.`);
    }

    resetForm();
    clearFilters();
    setActiveTab('menu');
  };

  const handleCancelEdit = () => {
    resetForm();
    setActiveTab('menu');
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setDishName(item.dishName);
    setDescription(item.description);
    setCourse(item.course);
    setPrice(String(item.price));
    setErrors({});
    setActiveTab('form');
  };

  const handleDelete = (item) => {
    confirmDelete(item.dishName, () => {
      setMenuItems((current) => current.filter((menuItem) => menuItem.id !== item.id));
      if (editingId === item.id) resetForm();
      showFeedback(`"${item.dishName}" deleted.`);
    });
  };

  const isFiltering = searchQuery.trim() !== '' || selectedCourse !== 'All';
  const visibleItems = filterMenuItems(menuItems, searchQuery, selectedCourse);
  const stats = calculateStats(menuItems);

  const tabs = [
    { key: 'menu', label: `Menu (${menuItems.length})` },
    { key: 'form', label: editingId ? 'Edit Item' : 'Add Item' },
    { key: 'stats', label: 'Statistics' },
  ];

  const renderMenuScreen = () => (
    <FlatList
      data={visibleItems}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.screenContent}
      keyboardShouldPersistTaps="handled"
      ListHeaderComponent={
        <View>
          <Text style={styles.screenTitle}>
            {isFiltering && menuItems.length > 0
              ? `Showing ${visibleItems.length} of ${menuItems.length} items`
              : `Menu Items (${menuItems.length})`}
          </Text>

          <View style={styles.searchRow}>
            <View style={styles.searchInput}>
              <FormField
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search by dish name..."
              />
            </View>
            {isFiltering && (
              <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
                <Text style={styles.clearButtonText}>Clear</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.filterRow}>
            <CourseSelector
              options={['All', ...COURSES]}
              selected={selectedCourse}
              onSelect={setSelectedCourse}
            />
          </View>
        </View>
      }
      ListEmptyComponent={
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>
            {menuItems.length === 0
              ? 'No menu items added yet.'
              : 'No menu items match your search or filter.'}
          </Text>
          {menuItems.length === 0 && (
            <TouchableOpacity style={styles.button} onPress={() => setActiveTab('form')}>
              <Text style={styles.buttonText}>Add your first item</Text>
            </TouchableOpacity>
          )}
        </View>
      }
      renderItem={({ item }) => (
        <MenuItemCard item={item} onEdit={startEdit} onDelete={handleDelete} />
      )}
    />
  );

  const renderFormScreen = () => (
    <ScrollView
      contentContainerStyle={styles.screenContent}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.screenTitle}>{editingId ? 'Edit Menu Item' : 'Add Menu Item'}</Text>

      <FormField
        label="Dish Name"
        value={dishName}
        onChangeText={setDishName}
        placeholder="e.g. Steak and Mash"
        maxLength={40}
        error={errors.dishName}
      />

      <FormField
        label="Description"
        value={description}
        onChangeText={setDescription}
        placeholder="e.g. Grilled steak served with creamy mash"
        multiline
        maxLength={120}
        error={errors.description}
      />

      <Text style={styles.label}>Course</Text>
      <CourseSelector options={COURSES} selected={course} onSelect={setCourse} />

      <FormField
        label="Price (R)"
        value={price}
        onChangeText={setPrice}
        placeholder="e.g. 145"
        keyboardType="numeric"
        error={errors.price}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>{editingId ? 'Update Item' : 'Add Item'}</Text>
      </TouchableOpacity>

      {editingId && (
        <TouchableOpacity style={styles.secondaryButton} onPress={handleCancelEdit}>
          <Text style={styles.secondaryButtonText}>Cancel Edit</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );

  const renderStatsScreen = () => (
    <ScrollView contentContainerStyle={styles.screenContent}>
      <Text style={styles.screenTitle}>Menu Overview</Text>
      <StatsCard stats={stats} />
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chef's Menu Manager</Text>

      <View style={styles.bannerWrapper}>
        <FeedbackBanner feedback={feedback} />
      </View>

      <View style={styles.content}>
        {activeTab === 'menu' && renderMenuScreen()}
        {activeTab === 'form' && renderFormScreen()}
        {activeTab === 'stats' && renderStatsScreen()}
      </View>

      <TabBar tabs={tabs} activeKey={activeTab} onChange={setActiveTab} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    color: COLORS.text,
  },
  bannerWrapper: {
    paddingHorizontal: 20,
  },
  content: {
    flex: 1,
  },
  screenContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  screenTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: COLORS.text,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 4,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 14,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: '600',
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    padding: 14,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
  },
  clearButton: {
    backgroundColor: '#e2e8f0',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  clearButtonText: {
    color: '#334155',
    fontWeight: '600',
  },
  filterRow: {
    marginBottom: 12,
  },
  emptyBox: {
    alignItems: 'center',
    marginTop: 10,
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
  },
});