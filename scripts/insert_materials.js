const { createClient } = require('@supabase/supabase-js')

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xkgyaafgtbadzsofapkj.supabase.co'
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhrZ3lhYWZndGJhZHpzb2ZhcGtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExODk0MjgsImV4cCI6MjA3Njc2NTQyOH0.FW7jdMzysvt_JbFkHXY8twhid0a9m0-lULuAxKGmaJE'

const supabase = createClient(supabaseUrl, supabaseKey)

async function insertMaterials() {
  console.log('Inserting new materials...')

  // DKV Material
  const dkvMaterial = {
    title: 'Design Principles',
    description: 'Learn fundamental design principles and tools',
    category: 'DKV',
    content: `## MATERI DESAIN GRAFIS DASAR

### 1. Pengertian Desain Grafis
Desain grafis adalah seni dan praktik visual untuk menyampaikan ide dan pesan melalui gambar, teks, dan bentuk. Desainer grafis menggunakan elemen visual untuk membuat komunikasi yang efektif dan menarik.

### 2. Elemen Dasar Desain
- **Garis**: Elemen paling dasar, bisa lurus, lengkung, tebal, tipis
- **Bentuk**: Geometri (lingkaran, persegi) dan organik (bebas)
- **Warna**: Hue, saturation, brightness
- **Tekstur**: Permukaan visual (halus, kasar, dll)
- **Ruang**: Area positif dan negatif
- **Tipografi**: Seni mengatur huruf dan teks

### 3. Prinsip Desain
- **Balance**: Keseimbangan visual
- **Contrast**: Perbedaan untuk menarik perhatian
- **Emphasis**: Fokus utama
- **Movement**: Alur mata pembaca
- **Pattern**: Pengulangan elemen
- **Rhythm**: Ritme visual
- **Unity**: Kesatuan keseluruhan

### 4. Teori Warna
- **Warna Primer**: Merah, Kuning, Biru
- **Warna Sekunder**: Hijau, Orange, Ungu
- **Warna Tersier**: Campuran primer + sekunder
- **Psikologi Warna**: Makna emosional warna

### 5. Tipografi
- **Font Family**: Serif, Sans-serif, Script, Display
- **Hierarchy**: Heading, subheading, body text
- **Kerning**: Jarak antar huruf
- **Leading**: Jarak antar baris
- **Alignment**: Rata kiri, kanan, tengah, justify`,
    content2: `### 6. Komposisi dan Layout
- **Rule of Thirds**: Membagi area menjadi 9 bagian
- **Golden Ratio**: Proporsi 1:1.618
- **Grid System**: Sistem pengaturan layout
- **White Space**: Ruang kosong yang strategis

### 7. Software Desain Populer
- **Adobe Photoshop**: Editing foto dan gambar
- **Adobe Illustrator**: Vektor graphics
- **Adobe InDesign**: Layout dan publishing
- **CorelDRAW**: Alternatif Adobe
- **GIMP**: Software gratis seperti Photoshop
- **Inkscape**: Software vektor gratis

### 8. Jenis-Jenis Desain Grafis
- **Logo Design**: Identitas merek
- **Poster Design**: Promosi acara
- **Banner Design**: Iklan digital
- **Packaging Design**: Desain kemasan
- **Web Design**: Interface website
- **Print Design**: Brosur, kartu nama, dll

### 9. Proses Desain
1. **Brief**: Memahami kebutuhan klien
2. **Research**: Studi referensi dan tren
3. **Sketch**: Ide awal dengan sketsa
4. **Digital Draft**: Konsep digital
5. **Refinement**: Perbaikan dan revisi
6. **Final**: Produk akhir

### 10. Tren Desain 2024
- **Minimalism**: Sederhana tapi powerful
- **3D Design**: Elemen tiga dimensi
- **Gradient**: Transisi warna halus
- **Typography**: Fokus pada huruf
- **Sustainability**: Desain ramah lingkungan`,
    content3: `### 11. Tools dan Resources
- **Color Palette Generator**: Coolors, Adobe Color
- **Font Libraries**: Google Fonts, Adobe Fonts
- **Stock Images**: Unsplash, Pexels
- **Icon Libraries**: Flaticon, Noun Project
- **Design Inspiration**: Behance, Dribbble, Pinterest

### 12. Career Path Desainer Grafis
- **Junior Designer**: 0-2 tahun pengalaman
- **Senior Designer**: 3-5 tahun pengalaman
- **Art Director**: 5+ tahun, leading tim
- **Freelancer**: Bekerja mandiri
- **Specialist**: UI/UX, Motion Graphics, dll

### 13. Soft Skills yang Dibutuhkan
- **Creativity**: Kemampuan berpikir kreatif
- **Communication**: Komunikasi dengan klien
- **Time Management**: Mengatur waktu
- **Adaptability**: Menyesuaikan dengan tren
- **Attention to Detail**: Perhatian pada detail

### 14. Portfolio Building
- **Personal Website**: Showcase karya
- **Behance/Dribbble**: Platform profesional
- **Case Studies**: Dokumentasi proses
- **Client Testimonials**: Testimoni klien

### Kesimpulan
Desain grafis adalah kombinasi seni dan teknologi. Dengan memahami elemen, prinsip, dan tools desain, Anda dapat menciptakan karya visual yang komunikatif dan menarik. Teruslah berlatih, ikuti tren terkini, dan bangun portfolio yang kuat untuk karir di bidang desain grafis.`,
    difficulty: 'Beginner',
    duration_minutes: 130
  }

  // TKJ Material
  const tkjMaterial = {
    title: 'Computer Networking',
    description: 'Understanding computer networks and telecommunications',
    category: 'TKJ',
    content: `## MATERI JARINGAN KOMPUTER

### 1. Pengertian Jaringan Komputer
Jaringan komputer adalah sistem yang menghubungkan komputer dan perangkat lain untuk berbagi sumber daya, berkomunikasi, dan bertukar data. Jaringan memungkinkan pengguna untuk mengakses informasi, printer, file, dan internet dari lokasi mana pun dalam jaringan.

### 2. Komponen Jaringan
- **Node**: Komputer, printer, atau perangkat lain
- **Server**: Komputer yang menyediakan layanan
- **Client**: Komputer yang menggunakan layanan
- **Media Transmission**: Kabel, wireless, fiber optic
- **Network Devices**: Router, switch, hub, modem
- **Protocol**: Aturan komunikasi (TCP/IP, HTTP, FTP)

### 3. Tipe Jaringan Berdasarkan Jangkauan
- **PAN (Personal Area Network)**: Jangkauan pribadi (< 10m)
- **LAN (Local Area Network)**: Jangkauan lokal (kantor, rumah)
- **MAN (Metropolitan Area Network)**: Jangkauan kota
- **WAN (Wide Area Network)**: Jangkauan nasional/global (internet)

### 4. Topologi Jaringan
- **Bus**: Semua perangkat terhubung ke satu kabel utama
- **Star**: Semua perangkat terhubung ke central hub/switch
- **Ring**: Perangkat terhubung membentuk lingkaran
- **Mesh**: Setiap perangkat terhubung ke semua perangkat lain
- **Tree**: Kombinasi star dan bus topology

### 5. Model OSI Layer
Layer 7: **Application** - Interface untuk aplikasi pengguna
Layer 6: **Presentation** - Format data, enkripsi
Layer 5: **Session** - Manajemen sesi komunikasi
Layer 4: **Transport** - Kontrol aliran data (TCP/UDP)
Layer 3: **Network** - Routing dan addressing (IP)
Layer 2: **Data Link** - Frame, MAC address
Layer 1: **Physical** - Kabel, sinyal elektrik

### 6. TCP/IP Protocol Suite
- **Application Layer**: HTTP, FTP, SMTP, DNS
- **Transport Layer**: TCP (reliable), UDP (fast)
- **Internet Layer**: IP, ICMP, ARP
- **Network Access Layer**: Ethernet, WiFi, PPP`,
    content2: `### 7. IP Addressing
- **IPv4**: 32-bit address (192.168.1.1)
- **IPv6**: 128-bit address (2001:0db8:85a3::8a2e:0370:7334)
- **Subnetting**: Membagi jaringan menjadi sub-jaringan
- **CIDR Notation**: 192.168.1.0/24
- **Private IP Ranges**: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16

### 8. Network Devices
- **Router**: Mengarahkan paket antar jaringan
- **Switch**: Menghubungkan perangkat dalam LAN
- **Hub**: Repeater sinyal (legacy)
- **Modem**: Modulasi/demodulasi sinyal
- **Access Point**: Titik akses WiFi
- **Firewall**: Keamanan jaringan

### 9. Wireless Networking
- **WiFi Standards**: 802.11a/b/g/n/ac/ax (WiFi 6)
- **Frequency Bands**: 2.4GHz, 5GHz, 6GHz
- **Security**: WEP, WPA, WPA2, WPA3
- **WiFi Modes**: Infrastructure, Ad-hoc, Mesh

### 10. Network Security
- **Authentication**: Verifikasi identitas
- **Encryption**: SSL/TLS, VPN
- **Firewall**: Filter traffic
- **Intrusion Detection**: Monitor aktivitas mencurigakan
- **Access Control**: Kontrol akses berdasarkan role

### 11. Troubleshooting Jaringan
- **Ping**: Test konektivitas
- **Traceroute**: Trace path paket
- **Netstat**: Status koneksi
- **IPConfig/IFConfig**: Konfigurasi IP
- **Wireshark**: Packet analyzer

### 12. Cloud Networking
- **Virtual Private Cloud (VPC)**
- **Load Balancing**
- **Content Delivery Network (CDN)**
- **Software Defined Networking (SDN)**`,
    content3: `### 13. Network Administration
- **Network Monitoring**: Tools seperti Nagios, Zabbix
- **Configuration Management**: Ansible, Puppet
- **Backup & Recovery**: Strategi backup jaringan
- **Documentation**: Dokumentasi jaringan
- **Performance Tuning**: Optimasi kecepatan dan reliability

### 14. Emerging Technologies
- **5G Networks**: High-speed mobile connectivity
- **IoT (Internet of Things)**: Connected devices
- **SDN & NFV**: Software-defined networking
- **Edge Computing**: Processing di network edge
- **Network Automation**: AI-driven network management

### 15. Career Path di Networking
- **Network Administrator**: Mengelola jaringan perusahaan
- **Network Engineer**: Desain dan implementasi jaringan
- **System Administrator**: Manajemen server dan infrastructure
- **Network Security Specialist**: Keamanan jaringan
- **Cloud Network Architect**: Desain jaringan cloud

### 16. Sertifikasi Networking
- **CompTIA Network+**: Fundamental networking
- **Cisco CCNA**: Cisco networking certification
- **Juniper JNCIA**: Juniper networking
- **AWS Certified Advanced Networking**: Cloud networking

### Kesimpulan
Jaringan komputer adalah fondasi dari dunia digital modern. Memahami konsep-konsep dasar networking, protokol, keamanan, dan troubleshooting akan membekali Anda dengan keterampilan yang sangat dibutuhkan di era digital ini. Teruslah belajar dan praktikkan konfigurasi jaringan untuk mengembangkan karir di bidang teknologi informasi.`,
    difficulty: 'Intermediate',
    duration_minutes: 140
  }

  // TRANS/TELKO Material
  const transMaterial = {
    title: 'Telecommunications Systems',
    description: 'Learn about telecommunication systems and technologies',
    category: 'TRANS/TELKO',
    content: `## MATERI TELEKOMUNIKASI

### 1. Pengertian Telekomunikasi
Telekomunikasi adalah teknologi yang memungkinkan transmisi informasi melalui jarak jauh menggunakan gelombang elektromagnetik, kabel, atau media lainnya. Kata "telekomunikasi" berasal dari bahasa Yunani: "tele" (jauh) dan "komunikasi" (komunikasi).

### 2. Sejarah Telekomunikasi
- **1837**: Telegraph oleh Samuel Morse
- **1876**: Telephone oleh Alexander Graham Bell
- **1895**: Radio oleh Guglielmo Marconi
- **1927**: Television oleh Philo Farnsworth
- **1970s**: Fiber optic dan satelit komunikasi
- **1980s**: Seluler telephony
- **1990s**: Internet dan digital communication
- **2000s**: 3G, 4G, broadband internet
- **2010s**: 5G, IoT, cloud computing

### 3. Prinsip Dasar Telekomunikasi
- **Transmitter**: Mengirim sinyal
- **Receiver**: Menerima sinyal
- **Channel**: Media transmisi
- **Noise**: Gangguan yang mengurangi kualitas sinyal
- **Bandwidth**: Rentang frekuensi yang digunakan
- **Modulation**: Mengubah sinyal untuk transmisi

### 4. Media Transmisi
- **Terestrial (Daratan)**:
  - **Twisted Pair**: Kabel tembaga twisted
  - **Coaxial Cable**: Kabel dengan isolasi
  - **Fiber Optic**: Kabel serat optik
  - **Wireless**: Radio, microwave, satellite

- **Satellite**: Komunikasi melalui satelit geostationary
- **Undersea Cable**: Kabel laut untuk komunikasi internasional

### 5. Sistem Telekomunikasi Modern
- **PSTN (Public Switched Telephone Network)**
- **ISDN (Integrated Services Digital Network)**
- **VoIP (Voice over IP)**
- **Cellular Networks (2G, 3G, 4G, 5G)**
- **Broadband Internet**
- **Cable TV Networks**
- **Satellite Communications**`,
    content2: `### 6. Signal Processing
- **Analog Signal**: Continuous signal (voice, video)
- **Digital Signal**: Discrete signal (binary data)
- **Sampling**: Mengubah analog ke digital
- **Quantization**: Mengubah continuous ke discrete values
- **Encoding**: Representasi data dalam format tertentu
- **Compression**: Mengurangi ukuran data
- **Error Correction**: Mendeteksi dan memperbaiki error

### 7. Modulation Techniques
- **Amplitude Modulation (AM)**
- **Frequency Modulation (FM)**
- **Phase Modulation (PM)**
- **Digital Modulation**: ASK, FSK, PSK, QAM
- **Spread Spectrum**: CDMA, OFDM
- **MIMO (Multiple Input Multiple Output)**

### 8. Jaringan Seluler
- **1G**: Analog voice (1980s)
- **2G**: Digital voice, SMS (GSM, CDMA)
- **3G**: Data services, video calling
- **4G LTE**: High-speed data, VoLTE
- **5G**: Ultra-fast, low latency, massive IoT

### 9. Fiber Optic Communications
- **Single Mode Fiber**: Long distance, high bandwidth
- **Multi Mode Fiber**: Short distance, lower cost
- **Wavelength Division Multiplexing (WDM)**
- **Optical Amplifiers**: EDFA, Raman amplifiers
- **Fiber Optic Sensors**: Monitoring applications

### 10. Satellite Communications
- **Geostationary Satellites**: 36,000km altitude
- **Low Earth Orbit (LEO)**: Starlink, OneWeb
- **Medium Earth Orbit (MEO)**: GPS, GLONASS
- **Satellite Transponders**: Frequency translation
- **VSAT (Very Small Aperture Terminal)**

### 11. Wireless Communications
- **Radio Frequency Spectrum**: 3kHz - 300GHz
- **Microwave Links**: Point-to-point communication
- **WiFi Networks**: IEEE 802.11 standards
- **Bluetooth**: Short-range wireless
- **NFC**: Near Field Communication`,
    content3: `### 12. Telekomunikasi Digital
- **Digital Switching**: Circuit switching vs Packet switching
- **Time Division Multiplexing (TDM)**
- **Frequency Division Multiplexing (FDM)**
- **Code Division Multiple Access (CDMA)**
- **Orthogonal Frequency Division Multiplexing (OFDM)**

### 13. Network Protocols
- **TCP/IP Suite**: Foundation of internet
- **HTTP/HTTPS**: Web communication
- **SMTP/POP3/IMAP**: Email protocols
- **SIP**: VoIP signaling
- **RTP**: Real-time transport
- **MPLS**: Multi-protocol label switching

### 14. Telekomunikasi di Indonesia
- **Operator Telekomunikasi**: Telkom, Indosat, XL, Tri
- **Infrastruktur**: Palapa Ring, 5G deployment
- **Regulasi**: Kementerian Komunikasi dan Informatika
- **Sertifikasi**: Sertifikat Kompetensi Telekomunikasi

### 15. Emerging Technologies
- **6G Networks**: Beyond 5G capabilities
- **Quantum Communications**: Ultra-secure communication
- **LiFi**: Light-based wireless communication
- **Holographic Communications**: 3D video calls
- **Brain-Computer Interfaces**: Neural communication

### 16. Career di Telekomunikasi
- **Network Engineer**: Desain dan maintenance jaringan
- **Telecom Technician**: Instalasi dan troubleshooting
- **RF Engineer**: Radio frequency optimization
- **System Administrator**: Manajemen infrastruktur
- **Telecom Consultant**: Advisory services
- **R&D Engineer**: Pengembangan teknologi baru

### 17. Tools dan Software Telekomunikasi
- **Network Analyzers**: Spectrum analyzers, protocol analyzers
- **Simulation Software**: MATLAB, NS-3, OPNET
- **Monitoring Tools**: SNMP, NetFlow
- **CAD Software**: AutoCAD untuk desain jaringan
- **Programming**: Python, C++ untuk automation

### Kesimpulan
Telekomunikasi adalah bidang yang terus berkembang pesat dengan teknologi baru seperti 5G, fiber optic, dan satelit. Memahami prinsip-prinsip dasar, teknologi modern, dan tren masa depan akan membekali Anda dengan pengetahuan yang komprehensif di bidang telekomunikasi. Industri ini menawarkan peluang karir yang luas di era digital saat ini.`,
    difficulty: 'Advanced',
    duration_minutes: 160
  }

  try {
    // Insert DKV material
    console.log('Inserting DKV material...')
    const { data: dkvData, error: dkvError } = await supabase
      .from('materials')
      .insert(dkvMaterial)
      .select()

    if (dkvError) {
      console.error('Error inserting DKV material:', dkvError)
    } else {
      console.log('DKV material inserted successfully:', dkvData)
    }

    // Insert TKJ material
    console.log('Inserting TKJ material...')
    const { data: tkjData, error: tkjError } = await supabase
      .from('materials')
      .insert(tkjMaterial)
      .select()

    if (tkjError) {
      console.error('Error inserting TKJ material:', tkjError)
    } else {
      console.log('TKJ material inserted successfully:', tkjData)
    }

    // Insert TRANS material
    console.log('Inserting TRANS/TELKO material...')
    const { data: transData, error: transError } = await supabase
      .from('materials')
      .insert(transMaterial)
      .select()

    if (transError) {
      console.error('Error inserting TRANS material:', transError)
    } else {
      console.log('TRANS material inserted successfully:', transData)
    }

    console.log('All materials inserted successfully!')

  } catch (error) {
    console.error('Unexpected error:', error)
  }
}

insertMaterials()
