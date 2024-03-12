module Fastlane
  module Actions
    class TelegramAction < Action
      def self.run(params)
        text = params[:text]
        uri = URI('https://api.telegram.org/bot564467928:AAGl1ZZMMufUFRP2cqwNyxNnvU7kUOgCdm0/sendMessage')
        params = { :text => text, :chat_id => -279124480 }
        uri.query = URI.encode_www_form(params)
        Net::HTTP.get(uri)
      end

      #####################################################
      # @!group Documentation
      #####################################################

      def self.description
        'Sends a message to Telegram chat'
      end

      def self.available_options
        [
          FastlaneCore::ConfigItem.new(key: :text,
                                       env_name: "FL_TELEGRAM_TEXT",
                                       description: "The message text",
                                       is_string: true,
                                       default_value: "")
        ]
      end

      def self.output
        [
          ['TELEGRAM_TEXT', 'The message text']
        ]
      end

      def self.authors
        ["anhtukhtn"]
      end

      def self.is_supported?(platform)
        true
      end
    end
  end
end
