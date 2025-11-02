import { api } from './api';

export const userService = {
  async getCurrentUser() {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  },

  async updateUserData() {
    try {
      const userData = await this.getCurrentUser();
      if (userData && userData.id) {
        const updatedUser = await api.get(`/usuarios/colaboradores/${userData.id}`);
        localStorage.setItem('userData', JSON.stringify(updatedUser));
        return updatedUser;
      }
    } catch (error) {
      console.error('Erro ao atualizar dados do usuário:', error);
    }
  }
};