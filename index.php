<?php
$summary = '';
$error = '';
$loading = false;

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['document'])) {
    $file = $_FILES['document'];
    
    // Validasi error upload
    if ($file['error'] !== UPLOAD_ERR_OK) {
        $error = "Terjadi kesalahan saat upload file. Kode error: " . $file['error'];
    } else {
        // Validasi ekstensi
        $allowedExts = ['pdf', 'docx', 'txt'];
        $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        
        if (!in_array($ext, $allowedExts)) {
            $error = "Format file tidak didukung. Harap upload PDF, DOCX, atau TXT.";
        } else {
            // Pastikan folder upload ada
            if (!file_exists('uploads')) {
                mkdir('uploads', 0777, true);
            }
            
            $filePath = 'uploads/' . time() . '_' . basename($file['name']);
            
            if (move_uploaded_file($file['tmp_name'], $filePath)) {
                // Panggil Node.js script
                // Jika 'node' tidak dikenali, ganti baris di bawah dengan full path, misal: 'C:\\Program Files\\nodejs\\node.exe'
                $nodeExecutable = 'C:\\laragon\\bin\\nodejs\\node-v18\\node.exe'; 
                $nodeScript = 'summarizer.js'; 
                
                // Gunakan escapeshellarg untuk keamanan
                $command = $nodeExecutable . " --no-warnings " . escapeshellarg($nodeScript) . " " . escapeshellarg($filePath);
                
                // Redirect stderr ke stdout untuk menangkap error
                $output = shell_exec($command . " 2>&1");
                
                // Debugging: uncomment baris bawah untuk melihat raw output jika ada masalah
                // echo "<pre>$output</pre>";
                
                $result = json_decode($output, true);
                
                if (json_last_error() === JSON_ERROR_NONE) {
                    if (isset($result['error'])) {
                        $error = $result['error'];
                    } else {
                        $summary = $result['summary'] ?? "Tidak ada ringkasan yang dihasilkan.";
                    }
                } else {
                    $error = "Gagal memproses output dari Node.js. Raw output: " . htmlspecialchars($output);
                }
                
                // Hapus file setelah diproses untuk menghemat ruang (opsional)
                // unlink($filePath); 
            } else {
                $error = "Gagal menyimpan file yang diupload.";
            }
        }
    }
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document Summarizer</title>
    <link rel="stylesheet" href="style.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">
</head>
<body>
    <div class="container">
        <header>
            <div class="logo">📄 DocSumm</div>
            <h1>Document Summarizer</h1>
            <p class="subtitle">Upload dokumen Anda (PDF, DOCX, TXT) dan biarkan AI meringkasnya untuk Anda.</p>
        </header>

        <main>
            <div class="card upload-section">
                <form method="POST" enctype="multipart/form-data" id="uploadForm">
                    <div class="file-drop-area">
                        <span class="fake-btn">Pilih File</span>
                        <span class="file-msg">atau drag & drop file di sini</span>
                        <input class="file-input" type="file" name="document" accept=".pdf,.txt,.docx" required>
                    </div>
                    <button type="submit" class="btn-submit" id="submitBtn">
                        <span class="btn-text">Ringkas Dokumen</span>
                        <span class="loader" style="display:none;"></span>
                    </button>
                </form>
            </div>

            <?php if ($error): ?>
                <div class="alert error">
                    <strong>Error:</strong> <?php echo htmlspecialchars($error); ?>
                </div>
            <?php endif; ?>

            <?php if ($summary): ?>
                <div class="card result-section">
                    <h2>Hasil Ringkasan</h2>
                    <div class="summary-content">
                        <p><?php echo nl2br(htmlspecialchars($summary)); ?></p>
                    </div>
                    <button class="btn-copy" onclick="copyToClipboard()">Salin Teks</button>
                </div>
            <?php endif; ?>
        </main>

        <footer>
            <p>&copy; <?php echo date('Y'); ?> Document Summarizer. Powered by Python & PHP.</p>
        </footer>
    </div>

    <script>
        const fileInput = document.querySelector('.file-input');
        const fileMsg = document.querySelector('.file-msg');
        const uploadForm = document.getElementById('uploadForm');
        const submitBtn = document.getElementById('submitBtn');
        const btnText = document.querySelector('.btn-text');
        const loader = document.querySelector('.loader');

        fileInput.addEventListener('change', function() {
            if (fileInput.files.length > 0) {
                fileMsg.textContent = fileInput.files[0].name;
            } else {
                fileMsg.textContent = 'atau drag & drop file di sini';
            }
        });

        uploadForm.addEventListener('submit', function() {
            submitBtn.disabled = true;
            btnText.style.display = 'none';
            loader.style.display = 'inline-block';
            submitBtn.classList.add('loading');
        });

        function copyToClipboard() {
            const text = document.querySelector('.summary-content').innerText;
            navigator.clipboard.writeText(text).then(() => {
                alert('Ringkasan berhasil disalin!');
            });
        }
    </script>
</body>
</html>
