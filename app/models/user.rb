class User < ActiveRecord::Base
  attr_accessor :password
  attr_accessor :invited

  has_many :employees
  has_many :companies, through: :employees
    
  validates_confirmation_of :password, unless: :invited?
  validates_presence_of :password, on: :create, unless: :invited?
  validates_presence_of :email
  validates_presence_of :first_name
  validates_presence_of :last_name
  validates_uniqueness_of :email

  before_save :encrypt_password
  before_create :generate_access_token

  after_save :send_invitation_email, if: :invited?                                     

  def self.authenticate(options = {})
    user = where(email: options[:email]).first
    
    if user && user.password_hash == BCrypt::Engine.hash_secret(options[:password], user.password_salt)
      user
    else
      nil
    end
  end

  def destroy_access_token
    update_attributes(access_token: nil)
  end

  def update_access_token
    update_attributes(access_token: SecureRandom.hex)
  end

  private
  
  def generate_access_token
    begin
      self.access_token = SecureRandom.hex
    end while self.class.exists?(access_token: access_token)
  end

  def encrypt_password
    if password.present?
      self.password_salt = BCrypt::Engine.generate_salt
      self.password_hash = BCrypt::Engine.hash_secret(password, password_salt)
    end
  end
end
