const Product = require('../models/Product');
const fs = require('fs');
const path = require('path');

// Local file database configuration
const mockDbPath = path.join(__dirname, '../../mock_db.json');

// Helper to determine inventory status
const calculateThreatLevel = (quantity, reorderLevel) => {
  if (quantity <= reorderLevel) return 'Critical';
  if (quantity <= reorderLevel * 2) return 'Low Stock';
  return 'Safe';
};

// Load products from JSON mock database file
const getMockProducts = () => {
  if (!fs.existsSync(mockDbPath)) {
    // Initial sample products to seed the mock database
    const initialData = [
      {
        _id: 'mock_1',
        productId: 'PROD-0001',
        productName: 'Finolex 1.5 Sqmm Copper Wire (90m)',
        category: 'Wires & Cables',
        parentCategory: 'Electrical',
        size: '1.5 sqmm',
        brand: 'Finolex',
        unitPrice: 1200,
        sellingPrice: 1500,
        quantity: 25,
        reorderLevel: 10,
        supplierName: 'Finolex Distributors Ltd',
        supplierContact: 'sales@finolexdist.com',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: 'mock_2',
        productId: 'PROD-0002',
        productName: 'Anchor Roma 1 Way Switch 6A',
        category: 'Switches',
        parentCategory: 'Electrical',
        size: 'Standard',
        brand: 'Anchor',
        unitPrice: 25,
        sellingPrice: 35,
        quantity: 120,
        reorderLevel: 50,
        supplierName: 'Anchor Electrical Junction',
        supplierContact: '+919876543210',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: 'mock_3',
        productId: 'PROD-0003',
        productName: 'Havells 16A Single Pole MCB',
        category: 'MCB',
        parentCategory: 'Electrical',
        size: '16A SP',
        brand: 'Havells',
        unitPrice: 150,
        sellingPrice: 210,
        quantity: 8,
        reorderLevel: 15,
        supplierName: 'Havells India Logistics',
        supplierContact: 'order@havellslogistics.com',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: 'mock_4',
        productId: 'PROD-0004',
        productName: 'Syska 9W LED Bulb B22',
        category: 'LED Lights',
        parentCategory: 'Electrical',
        size: '9W B22',
        brand: 'Syska',
        unitPrice: 70,
        sellingPrice: 99,
        quantity: 15,
        reorderLevel: 10,
        supplierName: 'Syska Light Agencies',
        supplierContact: 'support@syskalights.com',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: 'mock_5',
        productId: 'PROD-0005',
        productName: 'Orient Electric Apex-FX 1200mm Ceiling Fan',
        category: 'Fans',
        parentCategory: 'Electrical',
        size: '1200mm',
        brand: 'Orient',
        unitPrice: 1400,
        sellingPrice: 1850,
        quantity: 12,
        reorderLevel: 5,
        supplierName: 'Orient Fans Distributor',
        supplierContact: '+919988776655',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: 'mock_6',
        productId: 'PROD-0006',
        productName: 'Luminous RC 18000 150 Ah Battery',
        category: 'Battery',
        parentCategory: 'Electrical',
        size: '150 Ah',
        brand: 'Luminous',
        unitPrice: 9500,
        sellingPrice: 12500,
        quantity: 3,
        reorderLevel: 2,
        supplierName: 'Luminous Power Hub',
        supplierContact: 'power@luminoushub.com',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: 'mock_7',
        productId: 'PROD-0007',
        productName: 'Supreme PVC Pipe 4 Inch',
        category: 'Pipes',
        parentCategory: 'Hardware',
        size: '4 inch x 10ft',
        brand: 'Supreme',
        unitPrice: 350,
        sellingPrice: 480,
        quantity: 40,
        reorderLevel: 20,
        supplierName: 'Supreme Pipe Depot',
        supplierContact: 'pipes@supreme.com',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: 'mock_8',
        productId: 'PROD-0008',
        productName: 'Asian Paints Apcolite Premium Emulsion White',
        category: 'Paints',
        parentCategory: 'Hardware',
        size: '4 Litres',
        brand: 'Asian Paints',
        unitPrice: 850,
        sellingPrice: 1100,
        quantity: 5,
        reorderLevel: 5,
        supplierName: 'Asian Paints Dealers',
        supplierContact: '+918887776665',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: 'mock_9',
        productId: 'PROD-0009',
        productName: 'Taparia Combination Pliers 8 Inch',
        category: 'Tools',
        parentCategory: 'Hardware',
        size: '8 inch',
        brand: 'Taparia',
        unitPrice: 180,
        sellingPrice: 250,
        quantity: 18,
        reorderLevel: 5,
        supplierName: 'Taparia Tools Ltd',
        supplierContact: 'sales@tapariatools.co.in',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: 'mock_10',
        productId: 'PROD-0010',
        productName: 'M8 Steel Hex Bolt & Nut Set',
        category: 'Nuts & Bolts',
        parentCategory: 'Hardware',
        size: 'M8 x 50mm',
        brand: 'Unbrako',
        unitPrice: 8,
        sellingPrice: 12,
        quantity: 500,
        reorderLevel: 100,
        supplierName: 'Unbrako Fasteners Corp',
        supplierContact: 'info@unbrakocorp.com',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: 'mock_11',
        productId: 'PROD-0011',
        productName: 'Fevicol SH Synthetic Resin Adhesive',
        category: 'Adhesives',
        parentCategory: 'Hardware',
        size: '1 kg',
        brand: 'Pidilite',
        unitPrice: 210,
        sellingPrice: 270,
        quantity: 14,
        reorderLevel: 8,
        supplierName: 'Pidilite Industrial Agents',
        supplierContact: 'fevicol@pidilite.com',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: 'mock_12',
        productId: 'PROD-0012',
        productName: 'Godrej Round Padlock 7 Levers',
        category: 'Locks',
        parentCategory: 'Hardware',
        size: '50mm',
        brand: 'Godrej',
        unitPrice: 280,
        sellingPrice: 380,
        quantity: 22,
        reorderLevel: 5,
        supplierName: 'Godrej Locks Center',
        supplierContact: '+917776665554',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ].map(p => {
      p.threatLevel = calculateThreatLevel(p.quantity, p.reorderLevel);
      return p;
    });
    fs.writeFileSync(mockDbPath, JSON.stringify(initialData, null, 2));
    return initialData;
  }
  try {
    const data = JSON.parse(fs.readFileSync(mockDbPath, 'utf8'));
    return data.map(p => {
      p.threatLevel = calculateThreatLevel(p.quantity, p.reorderLevel);
      return p;
    });
  } catch (e) {
    console.error('Error reading JSON DB file:', e);
    return [];
  }
};

const saveMockProducts = (data) => {
  try {
    fs.writeFileSync(mockDbPath, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Error writing JSON DB file:', e);
  }
};

// Get all products (with pagination, filtering, searching, and sorting)
exports.getProducts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      category = '',
      parentCategory = '',
      brand = '',
      size = '',
      threatLevel = '',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    if (global.isMockMode) {
      let products = getMockProducts();

      // 1. Search Query (matches productName, brand, supplierName, or productId)
      if (search) {
        const regex = new RegExp(search, 'i');
        products = products.filter(p => 
          regex.test(p.productName) || 
          regex.test(p.brand || '') || 
          regex.test(p.supplierName || '') || 
          regex.test(p.productId || '')
        );
      }

      // 2. Filters
      if (category) {
        products = products.filter(p => p.category === category);
      }
      if (parentCategory) {
        products = products.filter(p => p.parentCategory === parentCategory);
      }
      if (brand) {
        products = products.filter(p => p.brand && p.brand.toLowerCase() === brand.toLowerCase());
      }
      if (size) {
        products = products.filter(p => p.size && p.size.toLowerCase() === size.toLowerCase());
      }
      if (threatLevel) {
        products = products.filter(p => p.threatLevel === threatLevel);
      }

      // 3. Sorting
      products.sort((a, b) => {
        let valA = a[sortBy];
        let valB = b[sortBy];
        
        // Handle undefined or null
        if (valA === undefined || valA === null) valA = '';
        if (valB === undefined || valB === null) valB = '';

        if (typeof valA === 'string') {
          return sortOrder === 'desc' 
            ? valB.localeCompare(valA)
            : valA.localeCompare(valB);
        } else {
          return sortOrder === 'desc' 
            ? valB - valA 
            : valA - valB;
        }
      });

      // 4. Pagination
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
      const skip = (pageNum - 1) * limitNum;
      const paginatedProducts = products.slice(skip, skip + limitNum);

      return res.status(200).json({
        success: true,
        count: paginatedProducts.length,
        total: products.length,
        page: pageNum,
        pages: Math.ceil(products.length / limitNum),
        products: paginatedProducts
      });
    }

    // --- MONGODB IMPLEMENTATION ---
    const query = {};

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { productName: searchRegex },
        { brand: searchRegex },
        { supplierName: searchRegex },
        { productId: searchRegex }
      ];
    }

    if (category) {
      query.category = category;
    }
    if (parentCategory) {
      query.parentCategory = parentCategory;
    }
    if (brand) {
      query.brand = new RegExp(`^${brand}$`, 'i');
    }
    if (size) {
      query.size = new RegExp(`^${size}$`, 'i');
    }

    if (threatLevel) {
      if (threatLevel === 'Critical') {
        query.$expr = { $lte: ['$quantity', '$reorderLevel'] };
      } else if (threatLevel === 'Low Stock') {
        query.$and = [
          { $expr: { $gt: ['$quantity', '$reorderLevel'] } },
          { $expr: { $lte: ['$quantity', { $multiply: ['$reorderLevel', 2] }] } }
        ];
      } else if (threatLevel === 'Safe') {
        query.$expr = { $gt: ['$quantity', { $multiply: ['$reorderLevel', 2] }] };
      }
    }

    const sort = {};
    if (sortBy === 'threatLevel') {
      sort.createdAt = sortOrder === 'desc' ? -1 : 1;
    } else {
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const products = await Product.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      products
    });
  } catch (error) {
    next(error);
  }
};

// Create Product
exports.createProduct = async (req, res, next) => {
  try {
    if (global.isMockMode) {
      const products = getMockProducts();
      
      // Auto-generate unique sequential productId in format PROD-XXXX
      let maxSeq = 0;
      products.forEach(p => {
        const match = p.productId.match(/PROD-(\d+)/);
        if (match) {
          const seq = parseInt(match[1]);
          if (seq > maxSeq) maxSeq = seq;
        }
      });
      const nextSeq = maxSeq + 1;
      const customId = `PROD-${String(nextSeq).padStart(4, '0')}`;

      const newProduct = {
        _id: 'mock_' + Math.random().toString(36).substr(2, 9),
        productId: customId,
        productName: req.body.productName,
        category: req.body.category,
        parentCategory: req.body.parentCategory,
        brand: req.body.brand || '',
        size: req.body.size || '',
        unitPrice: parseFloat(req.body.unitPrice) || 0,
        sellingPrice: parseFloat(req.body.sellingPrice) || 0,
        quantity: parseInt(req.body.quantity) || 0,
        reorderLevel: parseInt(req.body.reorderLevel) || 0,
        supplierName: req.body.supplierName || '',
        supplierContact: req.body.supplierContact || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      newProduct.threatLevel = calculateThreatLevel(newProduct.quantity, newProduct.reorderLevel);

      products.push(newProduct);
      saveMockProducts(products);

      return res.status(201).json({
        success: true,
        message: 'Product created successfully',
        product: newProduct
      });
    }

    // --- MONGODB IMPLEMENTATION ---
    const product = new Product(req.body);
    await product.save();
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    next(error);
  }
};

// Get Single Product
exports.getProductById = async (req, res, next) => {
  try {
    if (global.isMockMode) {
      const products = getMockProducts();
      const product = products.find(p => p._id === req.params.id);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }
      return res.status(200).json({
        success: true,
        product
      });
    }

    // --- MONGODB IMPLEMENTATION ---
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    next(error);
  }
};

// Update Product
exports.updateProduct = async (req, res, next) => {
  try {
    if (global.isMockMode) {
      const products = getMockProducts();
      const index = products.findIndex(p => p._id === req.params.id);
      if (index === -1) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      const updated = {
        ...products[index],
        productName: req.body.productName !== undefined ? req.body.productName : products[index].productName,
        category: req.body.category !== undefined ? req.body.category : products[index].category,
        parentCategory: req.body.parentCategory !== undefined ? req.body.parentCategory : products[index].parentCategory,
        brand: req.body.brand !== undefined ? req.body.brand : products[index].brand,
        size: req.body.size !== undefined ? req.body.size : products[index].size,
        unitPrice: req.body.unitPrice !== undefined ? parseFloat(req.body.unitPrice) : products[index].unitPrice,
        sellingPrice: req.body.sellingPrice !== undefined ? parseFloat(req.body.sellingPrice) : products[index].sellingPrice,
        quantity: req.body.quantity !== undefined ? parseInt(req.body.quantity) : products[index].quantity,
        reorderLevel: req.body.reorderLevel !== undefined ? parseInt(req.body.reorderLevel) : products[index].reorderLevel,
        supplierName: req.body.supplierName !== undefined ? req.body.supplierName : products[index].supplierName,
        supplierContact: req.body.supplierContact !== undefined ? req.body.supplierContact : products[index].supplierContact,
        updatedAt: new Date().toISOString()
      };
      updated.threatLevel = calculateThreatLevel(updated.quantity, updated.reorderLevel);

      products[index] = updated;
      saveMockProducts(products);

      return res.status(200).json({
        success: true,
        message: 'Product updated successfully',
        product: updated
      });
    }

    // --- MONGODB IMPLEMENTATION ---
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    next(error);
  }
};

// Delete Product
exports.deleteProduct = async (req, res, next) => {
  try {
    if (global.isMockMode) {
      let products = getMockProducts();
      const exists = products.some(p => p._id === req.params.id);
      if (!exists) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      products = products.filter(p => p._id !== req.params.id);
      saveMockProducts(products);

      return res.status(200).json({
        success: true,
        message: 'Product deleted successfully'
      });
    }

    // --- MONGODB IMPLEMENTATION ---
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get Dashboard Statistics
exports.getDashboardStats = async (req, res, next) => {
  try {
    if (global.isMockMode) {
      const products = getMockProducts();
      
      let totalQuantity = 0;
      let totalValue = 0;
      let criticalProducts = 0;
      let lowStockProducts = 0;

      products.forEach(p => {
        totalQuantity += p.quantity;
        totalValue += p.quantity * p.unitPrice;
        if (p.threatLevel === 'Critical') criticalProducts++;
        if (p.threatLevel === 'Low Stock') lowStockProducts++;
      });

      return res.status(200).json({
        success: true,
        stats: {
          totalProducts: products.length,
          totalQuantity,
          totalValue: parseFloat(totalValue.toFixed(2)),
          criticalProducts,
          lowStockProducts
        }
      });
    }

    // --- MONGODB IMPLEMENTATION ---
    const stats = await Product.aggregate([
      {
        $facet: {
          basicStats: [
            {
              $group: {
                _id: null,
                totalProducts: { $sum: 1 },
                totalQuantity: { $sum: '$quantity' },
                totalValue: { $sum: { $multiply: ['$quantity', '$unitPrice'] } }
              }
            }
          ],
          criticalCount: [
            {
              $match: {
                $expr: { $lte: ['$quantity', '$reorderLevel'] }
              }
            },
            { $count: 'count' }
          ],
          lowStockCount: [
            {
              $match: {
                $and: [
                  { $expr: { $gt: ['$quantity', '$reorderLevel'] } },
                  { $expr: { $lte: ['$quantity', { $multiply: ['$reorderLevel', 2] }] } }
                ]
              }
            },
            { $count: 'count' }
          ]
        }
      }
    ]);

    const basic = stats[0].basicStats[0] || { totalProducts: 0, totalQuantity: 0, totalValue: 0 };
    const critical = stats[0].criticalCount[0] ? stats[0].criticalCount[0].count : 0;
    const lowStock = stats[0].lowStockCount[0] ? stats[0].lowStockCount[0].count : 0;

    res.status(200).json({
      success: true,
      stats: {
        totalProducts: basic.totalProducts,
        totalQuantity: basic.totalQuantity,
        totalValue: parseFloat(basic.totalValue.toFixed(2)),
        criticalProducts: critical,
        lowStockProducts: lowStock
      }
    });
  } catch (error) {
    next(error);
  }
};

// Helper to retrieve all unique brands in database for filtering dropdown
exports.getUniqueBrands = async (req, res, next) => {
  try {
    if (global.isMockMode) {
      const products = getMockProducts();
      const brandsSet = new Set();
      products.forEach(p => {
        if (p.brand && p.brand.trim() !== '') {
          brandsSet.add(p.brand.trim());
        }
      });
      return res.status(200).json({
        success: true,
        brands: Array.from(brandsSet).sort()
      });
    }

    // --- MONGODB IMPLEMENTATION ---
    const brands = await Product.distinct('brand', { brand: { $ne: null, $gt: '' } });
    res.status(200).json({
      success: true,
      brands: brands.sort()
    });
  } catch (error) {
    next(error);
  }
};

// Helper to retrieve all unique sizes in database for filtering dropdown
exports.getUniqueSizes = async (req, res, next) => {
  try {
    if (global.isMockMode) {
      const products = getMockProducts();
      const sizesSet = new Set();
      products.forEach(p => {
        if (p.size && p.size.trim() !== '') {
          sizesSet.add(p.size.trim());
        }
      });
      return res.status(200).json({
        success: true,
        sizes: Array.from(sizesSet).sort()
      });
    }

    // --- MONGODB IMPLEMENTATION ---
    const sizes = await Product.distinct('size', { size: { $ne: null, $gt: '' } });
    res.status(200).json({
      success: true,
      sizes: sizes.sort()
    });
  } catch (error) {
    next(error);
  }
};
