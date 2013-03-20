from django.conf.urls import patterns, url

urlpatterns = patterns('',
	url(r'^$', 'app.views.home', name='home'),
)
