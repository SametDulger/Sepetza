namespace Sepetza.Core.DTOs;

public class ServiceResult
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    
    public static ServiceResult SuccessResult(string message = "") => new() { Success = true, Message = message };
    public static ServiceResult ErrorResult(string message) => new() { Success = false, Message = message };
} 