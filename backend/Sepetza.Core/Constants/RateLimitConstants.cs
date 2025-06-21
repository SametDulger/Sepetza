namespace Sepetza.Core.Constants;

public static class RateLimitConstants
{
    public const int AUTH_PERMIT_LIMIT = 5;
    public const int AUTH_QUEUE_LIMIT = 2;
    
    public const int GENERAL_PERMIT_LIMIT = 100;
    public const int GENERAL_QUEUE_LIMIT = 10;
    
    public const int CART_PERMIT_LIMIT = 30;
    public const int CART_QUEUE_LIMIT = 5;
    
    public const int WINDOW_MINUTES = 1;
} 