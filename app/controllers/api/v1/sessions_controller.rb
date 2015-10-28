module Api
  module V1
    class SessionsController < ApplicationController
      respond_to :json

      def create
        @user = User.authenticate(params)

        if @user
          @user.update_access_token
          render 'api/v1/users/show'
        else
          render json: { messages: 'bad credentials'}, status: :unauthorized
        end
      end
      
      def destroy
        if User.where(access_token: params[:access_token], id: params[:id])
            .first
            .try(:destroy_access_token)

          render json: { messages: 'signed out successfully' }, status: :ok
        else
          render json: { messages: 'not found' }, status: :not_found
        end
      end
    end
  end 
end
