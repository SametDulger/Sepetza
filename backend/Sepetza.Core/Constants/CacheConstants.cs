namespace Sepetza.Core.Constants;

public static class CacheConstants
{
    public const string CATEGORIES_CACHE_KEY = "categories_main_with_sub";
    public const string FEATURED_PRODUCTS_CACHE_KEY = "products_featured";
    public const string PRODUCT_CACHE_KEY_PREFIX = "product_";
    
    public const int CATEGORIES_CACHE_MINUTES = 60; // 1 saat
    public const int FEATURED_PRODUCTS_CACHE_MINUTES = 30; // 30 dakika
    public const int PRODUCT_CACHE_MINUTES = 15; // 15 dakika
} 