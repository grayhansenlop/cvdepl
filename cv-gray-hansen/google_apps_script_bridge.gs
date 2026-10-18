/**
 * ============================================================================
 * GOOGLE APPS SCRIPT: GOOGLE DRIVE LIVE FOLDER BRIDGE
 * ============================================================================
 * Cara Penggunaan:
 * 1. Buka https://script.google.com
 * 2. Buat "New Project" / "Proyek Baru"
 * 3. Hapus kode default dan tempelkan (paste) seluruh isi file ini.
 * 4. Klik "Deploy" (Terapkan) > "New deployment" (Penerapan baru).
 * 5. Pilih Type: "Web app" (Aplikasi web).
 * 6. Set Description: "Live Gallery Sync"
 * 7. Set Execute as: "Me" (Saya).
 * 8. Set Who has access: "Anyone" (Siapa saja).
 * 9. Klik "Deploy" dan salin URL Web App yang dihasilkan (contoh: https://script.google.com/macros/s/.../exec).
 * 10. Masukkan URL tersebut pada script.js (variabel `gasEndpoint`) atau simpan di modal Sync website.
 * 
 * Setiap ada foto baru yang di-upload ke folder Google Drive:
 * https://drive.google.com/drive/folders/1yMjZKi0HHhj7kbozoq8XraJQO9_3if7E
 * website akan otomatis menampilkan foto tersebut secara live tanpa perlu reload / deploy ulang!
 * ============================================================================
 */

function doGet(e) {
  try {
    var folderId = (e && e.parameter && e.parameter.folderId) ? e.parameter.folderId : "1yMjZKi0HHhj7kbozoq8XraJQO9_3if7E";
    var folder = DriveApp.getFolderById(folderId);
    var filesIter = folder.getFiles();
    var results = [];

    while (filesIter.hasNext()) {
      var file = filesIter.next();
      var mimeType = file.getMimeType();

      // Hanya ambil format gambar
      if (mimeType.indexOf("image/") !== -1 || mimeType === "application/octet-stream") {
        var id = file.getId();
        var name = file.getName();
        var size = file.getSize();
        var dateCreated = file.getDateCreated();
        var lastUpdated = file.getLastUpdated();

        // Tentukan orientasi berdasarkan nama atau rasio
        var lowerName = name.toLowerCase();
        var isLandscape = true;
        if (lowerName.includes("portrait") || lowerName.includes("flyer") || lowerName.includes("desain") || lowerName.includes("poster") || lowerName.includes("9-16") || lowerName.includes("9x16")) {
          isLandscape = false;
        }

        results.push({
          id: id,
          name: name,
          mimeType: mimeType,
          size: size,
          isLandscape: isLandscape,
          // URL gambar langsung resolusi tinggi
          imageUrl: "https://lh3.googleusercontent.com/d/" + id + "=w1600",
          thumbnailUrl: "https://lh3.googleusercontent.com/d/" + id + "=w800",
          driveUrl: "https://drive.google.com/file/d/" + id + "/view",
          downloadUrl: "https://drive.google.com/uc?export=view&id=" + id,
          createdTime: dateCreated,
          lastUpdated: lastUpdated
        });
      }
    }

    // Urutkan berdasarkan update terbaru
    results.sort(function(a, b) {
      return new Date(b.lastUpdated) - new Date(a.lastUpdated);
    });

    var payload = JSON.stringify({
      status: "success",
      folderId: folderId,
      total: results.length,
      files: results
    });

    return ContentService.createTextOutput(payload)
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    var errorPayload = JSON.stringify({
      status: "error",
      message: error.toString()
    });
    return ContentService.createTextOutput(errorPayload)
      .setMimeType(ContentService.MimeType.JSON);
  }
}
