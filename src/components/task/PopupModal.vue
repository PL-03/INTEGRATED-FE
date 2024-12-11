<script setup>
import { ref, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import { getToken, useRefreshToken } from "@/services/tokenService"
import { useToast, POSITION } from "vue-toastification"
const props = defineProps({
  selectedTaskId: {
    type: Object,
    required: true,
  },
})
const route = useRoute()
const router = useRouter()
const toast = useToast()
const boardId = route.params.boardId
const mimeTypes = {
  ".zip": "application/x-zip-compressed",
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".txt": "text/plain",
  ".json": "application/json",
  // Add more extensions as needed
}
function getMimeType(fileName) {
  const ext = fileName.slice(fileName.lastIndexOf("."))
  return mimeTypes[ext] || "application/octet-stream"
}
const formatDate = (dateString) => {
  if (!dateString) return "Date is undefined"

  const options = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    hourCycle: "h24",
  }
  const utcDate = new Date(dateString)
  const formatter = new Intl.DateTimeFormat("en-GB", options)
  const formattedDate = formatter.format(utcDate)
  return formattedDate
}

const closeModal = () => {
  router.push({ name: "tasklist", params: { boardId: route.params.boardId } })
}
const downloadAttachment = async (fileName) => {
  try {
    let token = getToken()
    if (!token) {
      await useRefreshToken()
      token = getToken()
    }

    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/v3/boards/${boardId}/tasks/${
        props.selectedTaskId.id
      }/attachments/${fileName}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error("Failed to download file")
    }

    const blob = await response.blob()
    const downloadUrl = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = downloadUrl
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(downloadUrl)
  } catch (error) {
    console.error("Download error:", error)
    showToast("Failed to download file", "error")
  }
}

// Method to preview a file attachment
const previewAttachment = async (fileName) => {
  try {
    let token = getToken()
    if (!token) {
      await useRefreshToken()
      token = getToken()
    }

    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/v3/boards/${boardId}/tasks/${
        props.selectedTaskId.id
      }/attachments/${fileName}/preview`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error("Failed to preview file")
    }

    const blob = await response.blob()
    const mimeType = getMimeType(fileName)

    // Open in new tab or window based on file type
    if (mimeType.startsWith("image/")) {
      // For images, create an image preview
      const imageUrl = URL.createObjectURL(blob)
      window.open(imageUrl, "_blank")
    } else if (mimeType === "application/pdf") {
      // For PDFs, open in browser
      const pdfUrl = URL.createObjectURL(blob)
      window.open(pdfUrl, "_blank")
    } else {
      // For other file types, trigger download
      downloadAttachment(fileName)
    }
  } catch (error) {
    console.error("Preview error:", error)
    showToast("Failed to preview file", "error")
  }
}
const showToast = (message, type) => {
  switch (type) {
    case "success-add":
    case "success-update":
      toast.success(message, { position: POSITION.TOP_CENTER, timeout: 3000 })
      break
    case "error":
      toast.error(message, { position: POSITION.TOP_CENTER, timeout: 3000 })
      break
    default:
      toast(message)
  }
}
</script>

<template>
  <div v-if="Object.keys(selectedTaskId).length > 0" class="modal">
    <div
      class="modal-content bg-gradient-to-t from-[#eff1da] to-[#ddedfc] font-lilita"
    >
      <span class="close" @click="closeModal">&times;</span>
      <p class="text-2xl text-[#675757]">Task Details</p>
      <br />
      <p class="break-words text-lg">
        <span class="mr-2"> Title:</span> {{ selectedTaskId.title }}
      </p>

      <div class="flex justify-center">
        <span
          class="itbkk-description bg-white shadow-slate-500/40 shadow-md mx-4 mt-2 w-6/12 rounded-lg p-6"
        >
          <span>Description</span><br />
          <div class="bg-[#536285] rounded-md w-96 h-36 p-4">
            <span
              v-if="selectedTaskId.description != null"
              class="text-white"
              >{{ selectedTaskId.description }}</span
            >
            <span v-else class="italic text-red-500"
              >No Description Provided</span
            >
          </div>

          <div class="flex">
            <div class="mr-4">
              <div class="itbkk-assignees">
                <span>Assignees</span><br />
                <div class="bg-[#536285] text-sm p-2 rounded-md w-48 h-16">
                  <span
                    v-if="selectedTaskId.assignees != null"
                    class="text-white"
                  >
                    {{ selectedTaskId.assignees }}
                  </span>
                  <span v-else class="italic text-gray-900">Unassigned</span>
                </div>
              </div>

              <div>
                <div class="itbkk-status">
                  <span>Status</span><br />
                  <div
                    class="text-white bg-[#536285] text-sm p-2 rounded-md w-48 h-16"
                  >
                    {{ selectedTaskId.status }}
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-4 bg-[#536285] w-52 p-2 rounded tracking-wide">
              <p class="itbkk-timezone">
                <span>Time Zone</span><br />
                <span class="text-white text-sm">{{
                  Intl.DateTimeFormat().resolvedOptions().timeZone
                }}</span>
              </p>

              <p class="itbkk-created-on">
                <span>Created Date</span><br />
                <span class="text-white text-sm">
                  {{ formatDate(selectedTaskId.createdOn) }}</span
                >
              </p>

              <p class="itbkk-updated-on">
                <span>Updated Date</span><br />
                <span class="text-white text-sm">{{
                  formatDate(selectedTaskId.updatedOn)
                }}</span>
              </p>
            </div>
          </div>
        </span>
        <span
          class="flex justify-center text-md w-80 mt-2 mr-8 bg-white shadow-lg text-black rounded-md font-lilita p-4 tracking-wide"
        >
          <div class="w-full">
            <h3 class="text-lg font-semibold mb-3 text-gray-700 border-b pb-2">
              Attachments
            </h3>
            <ul class="max-h-80 overflow-y-auto space-y-2">
              <li
                v-if="
                  !props.selectedTaskId.attachments ||
                  props.selectedTaskId.attachments.length === 0
                "
                class="text-gray-500 italic text-center py-4"
              >
                No attachments
              </li>
              <li
                v-for="(file, index) in props.selectedTaskId.attachments"
                :key="index"
                class="group flex items-center justify-center relative"
              >
                <div
                  class="relative w-48 h-36 bg-gray-100 hover:bg-gray-200 transition-colors duration-200 overflow-hidden"
                >
                  <img
                    src="../../assets/filePic.png"
                    class="object-cover w-20 h-20 absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  />
                  <div
                    class="flex absolute bottom-0 left-0 right-0 bg-black/70 text-white text-center p-1"
                  >
                    <button
                      @click="previewAttachment(file.name)"
                      class="text-[#ffffff] hover:text-[#d5dfde] transition-colors"
                      title="Preview"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path
                          fill-rule="evenodd"
                          d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </button>
                    <button
                      @click="downloadAttachment(file.name)"
                      class="text-[#37c6ff] hover:text-[#4353cc] transition-colors"
                      title="Download"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-9.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </button>
                    <div class="flex-grow min-w-0">
                      <p
                        class="text-white truncate max-w-[150px]"
                        :title="file.name"
                      >
                        {{ file.name }}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
ul::-webkit-scrollbar {
  width: 8px;
}
ul::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 8px;
}
ul::-webkit-scrollbar-thumb {
  background: #2c62ea;
  border-radius: 8px;
}
ul::-webkit-scrollbar-thumb:hover {
  background: #1c4ab8;
}

.modal {
  display: block;
  position: fixed;
  z-index: 1;
  padding-top: 100px;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.4);
}

/* Modal Content */
.modal-content {
  background-color: #f8f7f6;
  margin: auto;
  padding: 20px;
  border: 1px solid #888;
  width: 60%;
  max-height: 80vh;
  overflow-y: auto;
}

.itbkk-description span {
  word-wrap: break-word;
}

/* The Close Button */
.close {
  color: #545353;

  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: #9f0909;
  text-decoration: none;
  cursor: pointer;
}

.task-details-container {
  display: flex;
  justify-content: space-between;
}

.task-details-left {
  width: 60%;
}

.task-details-right {
  width: 35%;
  /* Adjust as needed */
}
ul::-webkit-scrollbar {
  width: 8px;
}
ul::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 8px;
}
ul::-webkit-scrollbar-thumb {
  background: #8a94a9;
  border-radius: 8px;
}
ul::-webkit-scrollbar-thumb:hover {
  background: #8a94a9;
}
@media screen and (min-width: 1024px) and (max-width: 1366px) {
  .modal-content {
    width: 80%; /* ลดขนาดของ modal ให้เล็กลง */
    padding: 15px; /* ลด padding */
  }

  .itbkk-description span {
    font-size: 0.9rem; /* ลดขนาดฟอนต์ใน modal */
  }

  .flex .itbkk-description {
    flex-direction: column; /* เปลี่ยน layout เป็นแนวตั้งเมื่อพื้นที่แคบ */
  }

  .itbkk-status, .itbkk-assignees {
    margin-bottom: 10px; /* เพิ่มช่องว่างระหว่าง block */
  }

  .flex .itbkk-timezone, .itbkk-created-on, .itbkk-updated-on {
    margin-bottom: 10px;
  }

  ul::-webkit-scrollbar {
    width: 6px; /* ลดความกว้าง scrollbar */
  }
}

/* Ensure good appearance for smaller widths */
@media screen and (max-width: 1024px) {
  .modal-content {
    width: 90%; /* ทำให้ modal กินพื้นที่มากขึ้นในหน้าจอเล็ก */
    padding: 10px;
  }

  .task-details-container {
    flex-direction: column; /* เปลี่ยน layout เป็นแนวตั้ง */
  }

  .task-details-left, .task-details-right {
    width: 100%; /* ให้แต่ละส่วนใช้ความกว้างเต็ม */
    margin-bottom: 15px;
  }

  .itbkk-timezone,
  .itbkk-created-on,
  .itbkk-updated-on {
    font-size: 0.9rem; /* ลดขนาดฟอนต์ */
  }
}
</style>
