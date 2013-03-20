from django.conf.urls import patterns, url

urlpatterns = patterns('',
	url(r'^$', 'images.views.home', name='home'),
)
