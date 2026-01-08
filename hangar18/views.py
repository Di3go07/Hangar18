from django.http import JsonResponse
from django.shortcuts import render

def users(request):
    if request.method == 'GET':
        user={
            'id':'1',
            'nome':'Diego'
        }

    return JsonResponse(user)

    