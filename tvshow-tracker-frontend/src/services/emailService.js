// src/services/emailService.js
export const emailService = {
    async sendRecommendationEmail(userEmail, recommendations) {
      // Em produção, integrar com: SendGrid, Mailgun, AWS SES, etc.
      console.log('📧 Enviando e-mail de recomendações para:', userEmail);
      console.log('🎬 Recomendações:', recommendations.map(r => r.title));
      
      // Mock - em produção, fazer chamada real à API de e-mail
      try {
        const response = await fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: userEmail,
            subject: '🎬 Suas Recomendações de TV Shows',
            recommendations: recommendations
          }),
        });
        
        return response.ok;
      } catch (error) {
        console.error('❌ Erro ao enviar e-mail:', error);
        return false;
      }
    }
  };