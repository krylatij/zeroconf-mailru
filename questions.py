# -*- coding: utf-8 -*-
from __future__ import unicode_literals


questions = (
    ("Web", (
        ("В каком из этих браузеров нет поддержки заголовка Content-Security-Policy?",
         ("Google Chrome", "Mozilla Firefox", "Safari", "Internet Explorer"),
         3),
        (
            'Какие шеллы изображены на картинках?  <img src="upload/shellushki.png" style="height: 300px;display: block;margin: 20px auto 0;" alt="">',
            ('WSO & r57shell', 'WSO & DxShell', 'DxShell & c99shell', 'WSO & c99shell'),
            1),
        ('Что из этого не является началом комментария в PHP?',
         ('/*', '#', '--', '//'),
         2),
        (
        'Какой из следующих векторов позволит провести атаку типа XSS, если будет передан в параметр p:<br>document.write(p.replace(/script/ig, '').toUpperCase()) ?',
        ("'&gt;&lt;script&gt;alert(1)&lt;/script&gt;", "&lt;ſcript/ſrc=//xsspayload.com&gt;&lt;/ſcript&gt;",
         "%3Cscript%3Ealert(1)%3C%2Fscript%3E", "&lt;scr+ipt&gt;alert(1)&lt;/scr+ipt&gt;"),
        1),
        (
        'Какой из перечисленных векторов не приведет к обходу защиты в следующем скрипте: <img src="upload/web800-php-new.png" style="height: 130px;display: block;margin: 20px auto 0;" alt="">',
        ('filename.pHp', 'filename.php.unknown', 'filename.phps', '.htaccess'),
        2),
    )),
    ("Crypto", (
        ('Какого вида шифрования не существует?',
         ('предполное', 'симметричное', 'блочное', 'ассиметричное'),
         0),
        ('Какой из следующих алгоритмов основан на сложности задачи факторизации?',
         ('SHA3', 'Diffie-Hellman', 'Lampart', 'RSA'),
         3),
        (
        'Какой шифр реализует это устройство? <img src="upload/disk.gif" style="height: 300px;display: block;margin: 20px auto 0;" alt="">',
        ('перестановочный', 'Энигма', 'Цезаря', 'AES в процессорах ARM'),
        2),
        ('На особенностях какого режима шифрования построена атака POODLE?',
         ('ECB', 'CBC', 'OFB', 'CTR'),
         1),
        ('Какое из этих преобразований не является аффинным преобразованием 32х битных векторов над полем F2?',
         ('0x421 * (x & 0x000F000F)', '(x - 1) & 0xF', 'MD5(x & 1) >> 96', 'CRC32(0xF1F1F1F1 ^ x)'),
         1),
    )),
    ("Binary", (
        ('Какая команда не меняет значение ESP?',
         ('CALL EBX', 'PUSH EBX', 'JMP ESP', 'SYSENTER'),
         2),
        ('Какая из техник применяется для обхода неисполняемой памяти?',
         ('SEH overwrite', 'ROP', 'JMP ESP', 'heap spray'),
         1),
        ('Что из нижеперечисленного не может быть использовано для загрузки DLL в адресное простанство?',
         ('таблица импорта', 'LoadLibrary', 'MapViewOfFile', 'CreateThreadEx'),
         3),
        ('Какой из данных системных вызовов используется функцией system(3)?',
         ('fork', 'open', 'brk', 'fcntl'),
         0),
        (
        'В каком варианте реализации отсутствует переполнение? <img src="upload/pwn800-c-new.png" style="height: 300px;display: block;margin: 20px auto 0;" alt="">',
        ('1', '2', '3', '4'),
        1),
    )),
    ("Network", (
        (
        'Какая программа была подвержена этой уязвимости?<img src="upload/shellshock.png" style="height: 350px;display: block;margin: 20px auto 0;" alt="">',
        ('systemd', 'bash', 'curl', 'env'),
        1),
        ('В чем отличие WPA2-enterprise от WPA2-psk?',
         ('в алгоритме шифрования', 'в возможности аутентификации с логином и паролем',
          'в увеличенной дальности действия', 'в увеличенной длине ключа'),
         1),
        ('Как называется утилита для подбора ключа WEP?',
         ('Kismet', 'Reaver', 'Aircrack-ng', 'Wireshark'),
         2),
        ('Какой протокол устанавливает выделенное соединение для передачи контрольных команд?',
         ('FTP', 'TFTP', 'XMPP', 'UUCP'),
         0),
        (
        'Что из перечисленного не влияет на количество одновременных исходящих TCP-соединений, которое может открыть программа?',
        ('Ограничение на количество открытых файлов (ulimit -n)', 'SO_REUSEPORT', 'Ephemeral port range',
         'SO_REUSEADDR'),
        1),
    )),
    ("Fun", (
        (
        'Что может защитить от того, что на картинке? <img src="upload/img-5.jpg" style="height: 150px;display: block;margin: 20px auto 0;" alt="">',
        ('Упаковка от яиц', 'Шапочка из фольги', 'Кактус', 'Антивирус'),
        0),
        ('На какой протокол нет стандарта RFC?',
         ('Доставка IP-пакетов почтовыми голубями', 'Передача электричества по IP-сетям', 'SPDY', 'HTTP/2'),
         2),
        ('Как зовут хакера, известного в том числе взломом DNS?',
         ('Kevin Mitnick', 'Geohot', 'Dan Kaminsky', 'Mario Heiderich'),
         2),
        ('Как называется фильм про хакеров с Анджелиной Джоли?',
         ('Хакеры', 'Матрица', 'Девушка с татуировкой дракона', 'Отладка'),
         0),
        ('Символ с каким названием не содержится в Unicode?',
         ('FISHING POLE AND FISH', 'MAN IN BUSINESS SUIT LEVITATING', 'ONE HAND CLAPPING', 'NIGHT WITH STARS'),
         2)
    ))
)
