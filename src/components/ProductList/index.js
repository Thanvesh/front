import React, { useContext, useState, useEffect } from 'react';
import { Table, Input, Select, Button, Modal, message, Spin } from 'antd';
import { SearchOutlined, PlusOutlined,ArrowLeftOutlined  } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ProductContext } from '../../Context/ProductContext';
import EditProductForm from '../EditForm';
import './index.css';

const { Search } = Input;
const { Option } = Select;

const ProductList = () => {
    const { products, setProducts } = useContext(ProductContext);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
    const [searchText, setSearchText] = useState('');
    const [categoryFilter, setCategoryFilter] = useState(null);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
    const [deletingProductId, setDeletingProductId] = useState(null);


    const navigate=useNavigate()

    useEffect(() => {
        const fetchProducts = () => {
            setLoading(true);
            axios.get('https://end-server.onrender.com/products')
                .then(response => {
                    setProducts(response.data.products);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching products:', error);
                    setLoading(false);
                    message.error('Failed to fetch products. Please try again later.');
                });
        };

        fetchProducts();
    }, [setProducts]);

    const handleTableChange = (pagination) => {
        setPagination(pagination);
    };

    const handleSearch = value => {
        setSearchText(value);
    };

    const handleCategoryFilter = value => {
        setCategoryFilter(value);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const handleEdit = product => {
        setSelectedProduct(product);
        setEditModalVisible(true);
    };

    const showConfirmDeleteModal = productId => {
        setDeletingProductId(productId);
        setConfirmDeleteVisible(true);
    };

    const handleConfirmDelete = () => {
        axios.delete(`https://end-server.onrender.com/products/${deletingProductId}`)
            .then(response => {
                setProducts(products.filter(product => product.id !== deletingProductId));
                setConfirmDeleteVisible(false);
                message.success(response.message);
            })
            .catch(error => {
                console.error('Error deleting product:', error);
                message.error(error);
            });
    };

    const filteredProducts = products.filter(product => {
        const searchString = searchText ? searchText.toString().toLowerCase() : '';
        return (
            (!searchString || product.name.toLowerCase().includes(searchString) ||
                product.description.toLowerCase().includes(searchString)) &&
            (!categoryFilter || product.category === categoryFilter)
        );
    });

    const getCategoryClass = (category) => {
        switch (category) {
            case 'Clothes': return 'category-clothes';
            case 'Mobile': return 'category-mobile';
            case 'Electronics': return 'category-electronics';
            case 'Home Appliances': return 'category-home-appliances';
            case 'Vehicles': return 'category-vehicles';
            default: return '';
        }
    };

    const columns = [
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
            width: '15%',
            filters: [
                { text: 'Clothes', value: 'Clothes' },
                { text: 'Mobile', value: 'Mobile' },
                { text: 'Electronics', value: 'Electronics' },
                { text: 'Home Appliances', value: 'Home Appliances' },
                { text: 'Vehicles', value: 'Vehicles' },
            ],
            onFilter: (value, record) => record.category === value,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        placeholder="Search Name"
                        value={selectedKeys[0]}
                        onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => handleSearch(selectedKeys[0])}
                        style={{ width: 188, marginBottom: 8, display: 'block' }}
                    />
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys[0])}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90, marginRight: 8 }}
                    >
                        Search
                    </Button>
                    <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                        Reset
                    </Button>
                </div>
            ),
            filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
            onFilter: (value, record) => record.name.toLowerCase().includes(value.toLowerCase()),
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            width: '25%',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            sorter: (a, b) => a.price - b.price,
            sortDirections: ['ascend', 'descend'],
            width: '10%',
        },
        {
            title: 'Action',
            key: 'action',
            width: '20%',
            render: (text, record) => (
                <span style={{ display: 'flex', gap: '8px' }}>
                    <Button type="primary" onClick={() => handleEdit(record)}>Edit</Button>
                    <Button type="danger" onClick={() => showConfirmDeleteModal(record.id)}>Delete</Button>
                </span>
            ),
        },
    ];

    return (
        <div className='product-list-container'>
            <div className='top-header-sec'>
                 <ArrowLeftOutlined onClick={() => navigate('/')} className='arrow'  />
                <h1 className="main-heading">Product Management Table</h1>
            </div>
            <div className='search-section' style={{ marginBottom: '16px' }}>
                <Search className='search-box' placeholder="Search by name or description" onSearch={handleSearch} style={{ width: 300, marginRight: '16px' }} />
                <div className='category-addbutton'>
                    <Select className='category-filter-box'
                        placeholder="Filter by category"
                        style={{ width: 200 }}
                        onChange={handleCategoryFilter}
                        allowClear
                    >
                        <Option value="Mobile">Mobile</Option>
                        <Option value="Electronics">Electronics</Option>
                        <Option value="Home Appliances">Home Appliances</Option>
                        <Option value="Vehicles">Vehicles</Option>
                    </Select>
                    <div className='add-section-con'>
                        <Link to="/add-product" className='btn-add'>
                            <Button type="primary">Add Product</Button>
                        </Link>
                        <Button
                            className="add-product-icon"
                            type="primary"
                            shape="circle"
                            icon={<PlusOutlined />}
                        />
                    </div>
                </div>

            </div>

            <Spin spinning={loading}>
                <Table
                    dataSource={filteredProducts}
                    columns={columns}
                    pagination={{ ...pagination, className: 'ant-table-pagination' }}
                    onChange={handleTableChange}
                    rowClassName={(record) => getCategoryClass(record.category)}
                />
            </Spin>
            <Modal
                title="Edit Product"
                open={editModalVisible}
                onCancel={() => setEditModalVisible(false)}
                footer={null}
            >
                {selectedProduct && (
                    <EditProductForm product={selectedProduct} closeModal={() => setEditModalVisible(false)} />
                )}
            </Modal>
            <Modal
                title="Confirm Delete"
                open={confirmDeleteVisible}
                onOk={handleConfirmDelete}
                onCancel={() => setConfirmDeleteVisible(false)}
                okText="Delete"
                cancelText="Cancel"
            >
                Are you sure you want to delete this product?
            </Modal>
        </div>
    );
};

export default ProductList;
