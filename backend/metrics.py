import psutil
import threading
import time
from collections import deque


def get_system_metrics():
    cpu_percent = psutil.cpu_percent(interval=0.5)
    mem = psutil.virtual_memory()
    return {
        "cpu_percent": cpu_percent,
        "memory_used": mem.used,
        "memory_total": mem.total,
        "memory_percent": mem.percent
    }


METRICS_HISTORY = deque(maxlen=60)

def collect_metrics():
    while True:
        METRICS_HISTORY.append({
            "timestamp": int(time.time()),
            "cpu_percent": psutil.cpu_percent(),
            "memory_percent": psutil.virtual_memory().percent,
            "disk_percent": psutil.disk_usage('/').percent
        })
        time.sleep(5)

def start_metrics_collector():
    t = threading.Thread(target=collect_metrics, daemon=True)
    t.start()

def get_metrics_history():
    return list(METRICS_HISTORY)