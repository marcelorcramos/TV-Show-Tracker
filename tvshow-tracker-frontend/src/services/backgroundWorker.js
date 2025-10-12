// src/services/backgroundWorker.js
import { emailService } from './emailService';

class BackgroundWorker {
  constructor() {
    this.isRunning = false;
    this.interval = null;
  }

  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    console.log('🔄 Trabalhador em segundo plano iniciado');
    
    // Verificar a cada 24 horas
    this.interval = setInterval(() => {
      this.checkAndSendRecommendations();
    }, 24 * 60 * 60 * 1000); // 24 horas
    
    // Executar imediatamente na primeira vez
    this.checkAndSendRecommendations();
  }

  stop() {
    this.isRunning = false;
    if (this.interval) {
      clearInterval(this.interval);
    }
    console.log('🛑 Trabalhador em segundo plano parado');
  }

  async checkAndSendRecommendations() {
    try {
      console.log('🔍 Verificando recomendações para e-mail...');
      
      // Obter usuários que optaram por receber e-mails
      const users = await this.getUsersWithEmailPreference();
      
      for (const user of users) {
        await this.sendUserRecommendations(user);
      }
    } catch (error) {
      console.error('❌ Erro no trabalhador em segundo plano:', error);
    }
  }

  async getUsersWithEmailPreference() {
    // Mock - em produção, buscar da base de dados
    const userEmail = localStorage.getItem('userEmail');
    const emailPreference = localStorage.getItem('emailNotifications') === 'true';
    
    if (userEmail && emailPreference) {
      return [{ email: userEmail, id: 1 }];
    }
    
    return [];
  }

  async sendUserRecommendations(user) {
    try {
      // Buscar recomendações do usuário
      const recommendations = await this.getUserRecommendations(user.id);
      
      if (recommendations.length > 0) {
        const success = await emailService.sendRecommendationEmail(
          user.email, 
          recommendations
        );
        
        if (success) {
          console.log('✅ E-mail enviado para:', user.email);
          this.updateLastEmailSent(user.id);
        }
      }
    } catch (error) {
      console.error('❌ Erro ao enviar e-mail para', user.email, error);
    }
  }

  async getUserRecommendations(userId) {
    // Mock - em produção, usar lógica real de recomendações
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    if (favorites.length === 0) return [];
    
    // Lógica simplificada de recomendações
    return favorites.slice(0, 3).map(fav => ({
      title: fav.title,
      genre: fav.genre,
      type: fav.type,
      rating: fav.rating
    }));
  }

  updateLastEmailSent(userId) {
    localStorage.setItem(`lastEmailSent_${userId}`, new Date().toISOString());
  }
}

export const backgroundWorker = new BackgroundWorker();