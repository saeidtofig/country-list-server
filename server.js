import express from "express";
import cors from "cors";
import { readFile } from "fs/promises";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Constants
const MAX_LIMIT = 100;
const DEFAULT_LIMIT = 10;
const DEFAULT_OFFSET = 0;

// All countries list
let allCountries;
try {
  const data = await readFile('./countries.json', 'utf8');
  allCountries = JSON.parse(data);
  console.log(`Loaded ${allCountries.length} countries`);
} catch (err) {
  console.error('Failed to load countries:', err);
  process.exit(1);
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: 'Something went wrong on our end'
  });
});

// Validate pagination parameters middleware
const validatePagination = (req, res, next) => {
  try {
    let offset = parseInt(req.query.offset);
    let limit = parseInt(req.query.limit);
    
    if (isNaN(offset)) offset = DEFAULT_OFFSET;
    if (isNaN(limit)) limit = DEFAULT_LIMIT;
    
    // Validate ranges
    if (offset < 0) {
      return res.status(400).json({
        error: 'Invalid offset',
        message: 'Offset must be a positive number',
        validRange: `0 - ${allCountries.length - 1}`
      });
    }
    
    if (limit <= 0 || limit > MAX_LIMIT) {
      return res.status(400).json({
        error: 'Invalid limit',
        message: `Limit must be between 1 and ${MAX_LIMIT}`,
        maxAllowed: MAX_LIMIT
      });
    }
    
    // Attach validated values to request
    req.validatedOffset = offset;
    req.validatedLimit = limit;
    
    next();
  } catch (err) {
    next(err);
  }
};

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'healthy',
    message: 'Country List API is running',
    endpoints: {
      countries: '/countries?offset=0&limit=10',
      documentation: 'Add your documentation URL here'
    }
  });
});

// Main countries endpoint
app.get("/countries", validatePagination, (req, res) => {
  try {
    const { validatedOffset: offset, validatedLimit: limit } = req;
    
    // Check if offset exceeds available data
    if (offset >= allCountries.length) {
      return res.status(200).json({
        results: [],
        count: allCountries.length,
        message: 'No more countries available at this offset'
      });
    }
    
    const paginatedCountries = allCountries.slice(offset, offset + limit);
    
    res.json({
      results: paginatedCountries.map(name => ({ name })),
      count: allCountries.length,
      pagination: {
        offset,
        limit,
        hasMore: offset + limit < allCountries.length,
        remaining: Math.max(0, allCountries.length - offset - limit)
      }
    });
  } catch (err) {
    next(err);
  }
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `The requested route ${req.path} does not exist`,
    availableRoutes: ['/', '/countries']
  });
});

app.listen(port, () => {
  console.log(`API running at http://localhost:${port}`);
  console.log(`Countries endpoint: http://localhost:${port}/countries`);
});