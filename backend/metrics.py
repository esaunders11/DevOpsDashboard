# backend/metrics.py
import psutil

def get_system_metrics():
    cpu_percent = psutil.cpu_percent(interval=0.5)
    mem = psutil.virtual_memory()
    return {
        "cpu_percent": cpu_percent,
        "memory_used": mem.used,
        "memory_total": mem.total,
        "memory_percent": mem.percent
    }
