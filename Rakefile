require 'rubygems'
require 'uglifier'

desc "Prepare development environment"
task :development do
  puts "Starting CoffeeScript for auto compiling"
  system "coffee -c -w tweet-list.coffee"
end

desc "Create minified version"
task :minify do
	minified = Uglifier.compile(File.read("tweet-list.js"))
	File.open('tweet-list.min.js', 'w') {|fh| fh.write minified}
	puts "#{Time.now.strftime('%H:%M:%S')} - compiled tweet-list.min.js"
end

task :default => :"development"
