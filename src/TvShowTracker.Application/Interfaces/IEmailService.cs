namespace TvShowTracker.Application.Interfaces
{
    public interface IEmailService
    {
        Task SendRecommendationEmailAsync(string toEmail, string userName, List<string> recommendations);
        Task SendWelcomeEmailAsync(string toEmail, string userName);
    }
}