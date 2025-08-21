#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdint.h>
#include <libgen.h>

#pragma pack(push, 1)
typedef struct {
    uint32_t size;
    uint32_t frames;
    uint32_t steps;
    uint32_t width;
    uint32_t height;
    uint32_t bits;
    uint32_t planes;
    uint32_t rate;
    uint32_t flags;
} ANICURSOR;
#pragma pack(pop)

void extract_ico(FILE *ani_file, const char *output_prefix, int frame_number) {
    char output_name[256];
    snprintf(output_name, sizeof(output_name), "%s_%d.ico", output_prefix, frame_number);
    
    FILE *ico_file = fopen(output_name, "wb");
    if (!ico_file) {
        printf("无法创建ICO文件: %s\n", output_name);
        return;
    }

    // 读取ICO数据
    uint32_t ico_size;
    if (fread(&ico_size, sizeof(uint32_t), 1, ani_file) != 1) {
        printf("读取ICO大小失败\n");
        fclose(ico_file);
        return;
    }

    printf("正在读取ICO数据，大小: %u 字节\n", ico_size);

    // 安全检查
    if (ico_size > 1024*1024 || ico_size < 4) { // 限制最大1MB，最小4字节
        printf("ICO文件大小异常: %u bytes\n", ico_size);
        fclose(ico_file);
        return;
    }
    
    uint8_t *buffer = malloc(ico_size);
    if (!buffer) {
        printf("内存分配失败\n");
        fclose(ico_file);
        return;
    }

    // 直接读取数据，不需要回退
    size_t bytes_read = fread(buffer, 1, ico_size, ani_file);
    if (bytes_read != ico_size) {
        printf("读取ICO数据不完整: 预期 %u 字节, 实际读取 %zu 字节\n", ico_size, bytes_read);
        // 继续处理已读取的数据
    }
    
    // 写入ICO文件
    size_t bytes_written = fwrite(buffer, 1, bytes_read, ico_file);
    if (bytes_written != bytes_read) {
        printf("写入ICO数据失败: 只写入了 %zu 字节\n", bytes_written);
    }
    
    free(buffer);
    fclose(ico_file);
    
    // 转换为PNG
    char command[512];
    snprintf(command, sizeof(command), "convert \"%s\" \"%s_%d.png\"", 
             output_name, output_prefix, frame_number);
    if (system(command) != 0) {
        printf("转换ICO到PNG失败，请确保已安装ImageMagick\n");
        return;
    }
    printf("成功创建PNG文件: %s_%d.png\n", output_prefix, frame_number);
}

void generate_cursor_config(const char *prefix, int frame_count, int delay_ms) {
    char config_name[256];
    snprintf(config_name, sizeof(config_name), "%s.config", prefix);
    
    FILE *config = fopen(config_name, "w");
    if (!config) {
        printf("无法创建配置文件: %s\n", config_name);
        return;
    }

    // xcursorgen配置格式：
    // <size> <xhot> <yhot> <filename> <ms-delay>
    for (int i = 0; i < frame_count; i++) {
        fprintf(config, "32 16 16 %s_%d.png %d\n", prefix, i, delay_ms);
    }

    fclose(config);
    printf("成功创建配置文件: %s\n", config_name);

    char command[512];
    snprintf(command, sizeof(command), "xcursorgen \"%s.config\" \"%s_cursor\"", 
             prefix, prefix);
    if (system(command) != 0) {
        printf("执行xcursorgen失败，请确保已安装xcursorgen\n");
        return;
    }
}

int main(int argc, char *argv[]) {
    if (argc < 2) {
        printf("用法: %s <ani文件> [延迟毫秒数]\n", argv[0]);
        return 1;
    }

    int delay_ms = (argc >= 3) ? atoi(argv[2]) : 50;
    
    // 创建输入文件的副本
    char *input_path = strdup(argv[1]);
    if (!input_path) {
        printf("内存分配失败\n");
        return 1;
    }
    
    // 安全地获取基本文件名
    char *base = basename(input_path);
    char output_prefix[256];
    strncpy(output_prefix, base, sizeof(output_prefix) - 1);
    output_prefix[sizeof(output_prefix) - 1] = '\0';
    
    char *dot = strrchr(output_prefix, '.');
    if (dot) *dot = '\0';

    FILE *ani_file = fopen(argv[1], "rb");
    if (!ani_file) {
        printf("无法打开文件: %s\n", argv[1]);
        free(input_path);
        return 1;
    }

    // 检查文件头
    char signature[12];
    if (fread(signature, 1, 12, ani_file) != 12) {
        printf("读取文件头失败\n");
        fclose(ani_file);
        free(input_path);
        return 1;
    }

    if (memcmp(signature, "RIFF", 4) != 0 || memcmp(signature + 8, "ACON", 4) != 0) {
        printf("不是有效的ANI文件\n");
        fclose(ani_file);
        free(input_path);
        return 1;
    }

    int frame_count = 0;
    char chunk_id[4];
    uint32_t chunk_size;

    // 读取块
    while (fread(chunk_id, 1, 4, ani_file) == 4) {
        if (fread(&chunk_size, sizeof(uint32_t), 1, ani_file) != 1) {
            break;
        }

        if (memcmp(chunk_id, "LIST", 4) == 0) {
            char list_type[4];
            if (fread(list_type, 1, 4, ani_file) != 4) {
                break;
            }

            if (memcmp(list_type, "fram", 4) == 0) {
                chunk_size -= 4; // 减去已读取的list_type大小
                long list_end = ftell(ani_file) + chunk_size;

                while (ftell(ani_file) < list_end && 
                       fread(chunk_id, 1, 4, ani_file) == 4) {
                    if (fread(&chunk_size, sizeof(uint32_t), 1, ani_file) != 1) {
                        break;
                    }

                    if (memcmp(chunk_id, "icon", 4) == 0) {
                        extract_ico(ani_file, output_prefix, frame_count++);
                    } else {
                        fseek(ani_file, chunk_size, SEEK_CUR);
                    }
                }
            } else {
                fseek(ani_file, chunk_size - 4, SEEK_CUR);
            }
        } else {
            fseek(ani_file, chunk_size, SEEK_CUR);
        }
    }

    fclose(ani_file);
    free(input_path);

    printf("成功提取了 %d 个帧\n", frame_count);

    if (frame_count > 0) {
        generate_cursor_config(output_prefix, frame_count, delay_ms);
        printf("已生成X11光标文件: %s_cursor\n", output_prefix);
        printf("要使用此光标，请将其复制到 ~/.icons/default/ 目录下\n");
    } else {
        printf("未能提取任何帧，请检查输入文件格式是否正确\n");
    }

    return 0;
}

