var app = angular.module('wa', ['ui.mask', 'angular-clipboard']);

    app.controller('mainController', function ($scope, $http, clipboard) {

        var servidor = 'http://whatsapp.lojasmm.com.br';

        $scope.criarLink = function () {
            if ($scope.telefone != undefined && $scope.mensagem != undefined) {
                $http({
                    method: 'GET',
                    url: servidor + 'validartelefone?telefone=' + $scope.telefone
                }).then(function successCallback(response) {
                    
                    if (response.data == true) {
                        var mensagemFormatada = $scope.mensagem.replace(/%/g, "%25");
                        var url = encodeURIComponent('https://api.whatsapp.com/send?phone=55' + $scope.telefone + '&text=' + mensagemFormatada);
                        var bitly = 'https://api-ssl.bitly.com/v3/shorten?access_token=c658048c9e402e5ef526531f452ce24da07ffd92&longUrl=';
                        var urlEncurtada = '';

                        $http({
                            method: 'GET',
                            url: bitly + url
                        }).then(function successCallback(response) {
                            urlEncurtada = response.data.data.url;
                            $http({
                                method: 'GET',
                                url: servidor + 'salvarurl?url=' + urlEncurtada + '&matricula=' + $scope.matricula
                            }).then(function successCallback(response) {
                                iziToast.show({
                                    theme: 'dark',
                                    icon: 'icon-person',
                                    title: 'Link Gerado:',
                                    message: urlEncurtada,
                                    overlay: true,
                                    position: 'center',
                                    progressBarColor: 'rgb(0, 255, 184)',
                                    buttons: [
                                        ['<button>Copiar</button>', function (instance, toast) {
                                            clipboard.copyText(urlEncurtada);
                                            iziToast.success({
                                                title: 'OK',
                                                message: 'Link copiado',
                                                position: 'topRight'
                                            });
                                            iziToast.hide({
                                                transitionOut: 'fadeOutUp'
                                            }, toast);
                                        }, true],
                                    ],
                                    onOpening: function (instance, toast) {
                                    },
                                    onClosing: function (instance, toast, closedBy) {
                                    }
                                });
                            },
                            function successCallback(response) {console.error(response)});
                        }, function errorCallback(response) {console.error(response)});
                    }
                    else {
                        iziToast.error({
                            title: 'Atenção',
                            message: 'Apenas telefone corporativos são permitidos',
                            position: 'center'
                        });
                    }
                }, function errorCallback(response) {console.error(response)});
            }
        }
    });