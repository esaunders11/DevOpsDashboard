import backend.metrics as metrics

def test_get_system_metrics(monkeypatch):
    monkeypatch.setattr(metrics.psutil, "cpu_percent", lambda interval: 42)
    monkeypatch.setattr(metrics.psutil, "virtual_memory", lambda: type("mem", (), {
        "percent": 55, "used": 123456, "total": 654321
    })())
    result = metrics.get_system_metrics()
    assert result["cpu_percent"] == 42
    assert result["memory_percent"] == 55
    assert result["memory_used"] == 123456
    assert result["memory_total"] == 654321