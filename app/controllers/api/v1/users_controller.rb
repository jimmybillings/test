module Api
  module V1
    class UsersController < ApplicationController
      
      def create
        @user = User.create(user_params)
        
        if @user.valid?
          render :show , status: :ok
        else
          render json: { messages: @user.errors.to_json }, status: :bad_request
        end
      end

      private
      
      def user_params
        params.require(:user).permit(:first_name,:last_name,:password,:email,:password_confirmation)
      end
    end
  end 

end
