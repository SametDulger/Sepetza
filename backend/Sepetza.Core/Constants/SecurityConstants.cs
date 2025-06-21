namespace Sepetza.Core.Constants;

public static class SecurityConstants
{
    public const int MAX_LOGIN_ATTEMPTS = 5;
    public const int LOCKOUT_DURATION_MINUTES = 15;
    public const int JWT_EXPIRATION_MINUTES = 4320; // 72 saat
    public const int BCRYPT_WORK_FACTOR = 12;
    public const int MIN_PASSWORD_LENGTH = 6;
    public const int MAX_PASSWORD_LENGTH = 100;
} 