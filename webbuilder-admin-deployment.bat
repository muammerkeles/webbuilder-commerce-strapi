::## Proje docker ile build edilmiş ve image hazır durumda iken;
for /F "tokens=1-2 delims=:." %%A in ("%time%") do (
    SET time=%%A-%%B
)
SET appName=ecommerce-webadmin
SET volumeName=herkeseweb-ecommerce-uploads
SET dockerImageTarFileName=%appName%.tar
SET tag=latest
SET sshTarget=azurevm
SET destinationPathToDockerImageTarFile=~/../../media/data1/docker-images/%dockerImageTarFileName%
SET appPort=5051
SET firstContainerPort=5051
SET secondContainerPort=50510

:begin
@echo off
echo ##   Secim yapin:
echo ##   0 Tum islemleri sirayla yapmak.
echo ##   1 Yeni bir docker image olustur.
echo ##   2 Docker Image'dan bir .tar dosyasi olustur.
echo ##   3 .tar dosyasi olusturmadan mevcut tar dosyasini transfer ederek devam et.
echo ##   4 Dosya transferi yapmadan servera baglanip server'daki docker image'ini calistir
echo ##   5 Mevcut %dockerImageTarFileName% dosyasini transfer et ve servera baglanip deploy yap.
::##echo ##   6 Sunucudaki .tar dosyasi ile Demo deployment'i yap.

set /p secenek=""
if %secenek% == 0 (
    goto step0
)
if %secenek% == 1 (
    goto step0
)

if %secenek% == 2 goto step1
if %secenek% == 3 goto step2
if %secenek% == 4 goto step3
if %secenek% == 5 goto step2
::##if %secenek% == 6 goto step4

:step0
    echo .
    echo ## Docker image olusturuluyor : %appName%
    docker build -t %appName%:latest -f Dockerfile.prod .
    echo Olusturuldu.
    echo .
    echo .
     if %secenek% == 0 (
        goto step1
    ) else (
        goto begin
    )
:step1
    ::##Create ".tar" file from local docker image
    echo ####  %secenek% secildi. %dockerImageTarFileName% dosyasi olusturuluyor
    docker save -o %dockerImageTarFileName% %appName%:%tag% 
    echo .
    echo Olusturuldu
    echo . 
    if %secenek% == 0 (
        goto step2
    ) else (
        goto begin
    )
:step2
            @REM     if exist %dockerImageTarFileName% (
            @REM         echo Yes 
            @REM     ) else (
            @REM         setlocal enabledelayedexpansion
            @REM         set count=0
            @REM         echo %dockerImageTarFileName% dosyasi bulunamadi. Asagidakilerden hangisi ile devam edilsin?
            @REM         for /r %%a in (*.tar) do (
            @REM             set /a count+=1
            @REM             set "file!count!=%%~nxa"
            @REM             echo !count!. %%~nxa
            @REM         )
            @REM echo "Bir dosya sec (1-!count!):"
            @REM         set /p secim=

            @REM         rem Seçilen dosyayı ekrana yazdır
            @REM         if defined file%secim% (
            @REM             set "selected_file=!file%secim%!"
            @REM             echo Secilen dosya: !selected_file!
            @REM         ) else (
            @REM             echo Geçersiz seçim!
            @REM         )
            @REM         setlocal disabledelayedexpansion

            @REM     )
            @REM     pause
    ::##Transfer the ".tar" file to server 
    echo ####  %secenek% secildi. .tar dosyasi bu konuma transfer ediliyor: %destinationPathToDockerImageTarFile%
    scp %dockerImageTarFileName% %sshTarget%:%destinationPathToDockerImageTarFile%
    echo ..
    echo Transfer edildi
    echo ..
    if %secenek% == 0 goto step3
    if %secenek% == 3 goto step3
    if %secenek% == 5 (
        goto step3
    ) else (
        goto begin
    )
:step3
    echo . 
    echo ####  %secenek% secildi. Server'a baglanilip : Deploy islemi yapilacak
    echo . 
    echo . 
    ::set /p sec="Serverda calisan containeri durdur ve sil? (y) (n) default is n :" 
    echo .
    SET paramSet=%paramSet% "echo '## Docker Image Yukleniyor:' && sudo docker load -i %destinationPathToDockerImageTarFile% && echo '### Yuklendi.'"
    
    :: 1st container
    SET paramSet=%paramSet% " && echo '### Simdi Calisan Docker (%appName%) container durduruluyor.' && sudo docker rm -f %appName% &&  echo '### Durduruldu.' && echo '### Siliniyor' && sudo docker container rm -f %appName% && echo '### Silindi.'" 
    SET paramSet=%paramSet% " && echo '## Docker Image Listesi:'  && sudo docker ps && echo '## Docker Volume Listesi:' &&  sudo docker volume ls"
    SET paramSet=%paramSet% " && echo '##Simdi yenisi calistiriliyor...' && sudo docker run -d --name %appName% -p %firstContainerPort%:%appPort% -e HOST=0.0.0.0 -e PORT=%appPort% -v %volumeName%:/opt/app/public/uploads --network net0 --memory="1g" --cpus=".5" --restart always %appName%:%tag% && echo '### Bitti..'"

    :: 2nd container
    SET paramSet=%paramSet% " && echo '### Simdi Calisan 2. Docker (%appName%-2) container durduruluyor.' && sudo docker rm -f %appName%-2 &&  echo '### Durduruldu.' && echo '### Siliniyor' && sudo docker container rm -f %appName%-2 && echo '### Silindi.'" 
    SET paramSet=%paramSet% " && echo '## Docker Image Listesi:'  && sudo docker ps && echo '## Docker Volume Listesi:' &&  sudo docker volume ls"
    SET paramSet=%paramSet% " && echo '##Simdi 2. container calistiriliyor...' && sudo docker run -d --name %appName%-2 -p %secondContainerPort%:%appPort% -e HOST=0.0.0.0 -e PORT=%appPort% -v %volumeName%:/opt/app/public/uploads --network net0 --memory="1g" --cpus=".5" --restart always %appName%:%tag% && echo '### Bitti..'"

    ::if %sec% == y SET paramSet=%killParaParam% %paramSet%
     SET paramSet=%killParaParam% %paramSet%
        ::echo %paramSet%
        ::##Connect to remote server and then run commants 
            ::##    Load the transferred Docker image on server 
            ::##    Stop & Remove existing container with same name 
            ::##    Run Docker image 
    ssh %sshTarget% %paramSet%
    if %secenek% == 0 (
        pause

    ) else (
        goto begin
    )
    :step4
    ::##SET paramSet= "echo '## Calisan Docker container durduruluyor: (%appName%-demo)' && sudo docker rm -f %appName%-demo"
    ::##SET paramSet=%paramSet% " && echo '## Anlik Docker Image Listesi' && sudo docker ps"
    ::##SET paramSet=%paramSet% " && echo '## Docker container calistiriliyor: (%appName%-demo)' && sudo docker run -d --name %appName%-demo -p 5049:%appPort% -e DATABASE_NAME=herkeseweb_strapi_demo -e DATABASE_FILENAME=herkeseweb_strapi_demo -e DATABASE_USERNAME=herkeseweb_admin_demo -e HOST=0.0.0.0 -e PORT=%appPort% -v herkeseweb-uploads:/opt/app/public/uploads --network net0 --memory="1g" --cpus=".5" --restart always %appName%:%tag%"
    
    ::##echo #### SSH baglantisi kuruluyor: %sshTarget%
    ::##ssh %sshTarget% %paramSet%

    goto begin
pause