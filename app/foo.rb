require 'json'
require 'sinatra'
require 'net/http'
require 'rest-client'
require 'byebug'
require 'json'
get '/food-from-image' do 
  content_type :json
  response['Access-Control-Allow-Origin'] = '*'
  getTagFromImage(params[:url])
end

get '/food-description' do
  response['Access-Control-Allow-Origin'] = '*'
  food_desc(params['token'])
end

def getTagFromImage(imageUrl)
  baseUrl = 'http://api.cloudsightapi.com/'
  urlRes = 'image_responses/'
 
  urlReq = 'image_requests'
  key = 'jFyNUdhfuM7riyzlIDHNPg';

  request = RestClient::Request.new(
    :method => :post,
    :url => baseUrl + urlReq,
    :headers => {
      :Authorization => "CloudSight " + key
    },
    :payload => {
      "image_request[locale]" => "en-US",
      "image_request[remote_image_url]" => imageUrl
    }
  )
  request.execute
end

def food_desc(token)
  baseUrl = 'http://api.cloudsightapi.com/'
  urlRes = 'image_responses/'
  key = 'jFyNUdhfuM7riyzlIDHNPg';

  req2 = RestClient::Request.new(
    :method => :get,
    :url => baseUrl + urlRes + token,
    :headers => {
      :Authorization => "CloudSight " + key
    }
  )
  req2.execute
end
